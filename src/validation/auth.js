import Joi from 'joi';

import { emailRegex } from '../constants/users.js';

export const authRegister = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
});

export const authLogin = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
});

export const requestResetEmail = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
});

export const resetPassword = Joi.object({
  password: Joi.string().min(6).required(),
  token: Joi.string().required(),
});