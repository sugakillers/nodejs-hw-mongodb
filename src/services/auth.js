import createHttpError from 'http-errors';

import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';
import { fifteenMinutes, thirtyDays } from '../constants/users.js';
import { SMTP, TEMPLATES_DIR } from '../constants/smtp.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';

import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

const createSessionData = () => ({
  accessToken: randomBytes(30).toString('hex'),
  refreshToken: randomBytes(30).toString('hex'),
  accessTokenValidUntil: new Date(Date.now() + fifteenMinutes),
  refreshTokenValidUntil: new Date(Date.now() + thirtyDays),
});

export const register = async (payload) => {
  const { email, password } = payload;

  const user = await UserCollection.findOne({ email });
  if (user) throw createHttpError(409, 'Email in use');

  const hashPassword = await bcrypt.hash(password, 10);

  return await UserCollection.create({
    ...payload,
    password: hashPassword,
  });
};
export const login = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });
  if (!user) throw createHttpError(401);

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw createHttpError(401);

  await SessionCollection.deleteOne({ userId: user._id });

  const sessionData = createSessionData();

  return await SessionCollection.create({
    userId: user._id,
    ...sessionData,
  });
};
export const refreshToken = async (payload) => {
  const oldSession = await SessionCollection.findOne({
    _id: payload.sessionId,
    refreshToken: payload.refreshToken,
  });

  if (!oldSession) throw createHttpError(401, 'Session not found');
  if (Date.now() > oldSession.refreshTokenValidUntil)
    throw createHttpError(401, 'Refresh token expired');

  await SessionCollection.deleteOne({ _id: payload.sessionId });

  const sessionData = createSessionData();

  return await SessionCollection.create({
    userId: oldSession.userId,
    ...sessionData,
  });
};
export const logout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};
export const getSession = (filter) => SessionCollection.findOne(filter);
export const getUser = (filter) => UserCollection.findOne(filter);

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found!');
  try {
    const resetToken = jwt.sign(
      { sub: user._id, email },
      getEnvVar('JWT_SECRET'),
      {
        expiresIn: '5m',
      },
    );

    const resetPasswordTemplatePath = path.join(
      TEMPLATES_DIR,
      'reset-password-email.html',
    );
    const templateSource = (
      await fs.readFile(resetPasswordTemplatePath)
    ).toString();
    const template = handlebars.compile(templateSource);
    const html = template({
      name: user.name,
      link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
    });

    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(
        500,
        'Failed to send the email, please try again later.',
      );
    throw err;
  }
};

export const resetPassword = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, 'Token is expired or invalid.');
    throw err;
  }

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) throw createHttpError(404, 'User not found');

  const hashPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.updateOne({ _id: user._id }, { password: hashPassword });
};