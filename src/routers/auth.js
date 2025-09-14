import { Router } from 'express';
import * as authControllers from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import * as schema from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(schema.authRegister),
  ctrlWrapper(authControllers.registerController),
);
authRouter.post(
  '/login',
  validateBody(schema.authLogin),
  ctrlWrapper(authControllers.loginController),
);
authRouter.post(
    '/refresh',
    ctrlWrapper(authControllers.refreshTokenController)
);
authRouter.post(
    '/logout',
    ctrlWrapper(authControllers.logoutController)
);
authRouter.post(
  '/send-reset-email',
  validateBody(schema.requestResetEmail),
  ctrlWrapper(authControllers.requestResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(schema.resetPassword),
  ctrlWrapper(authControllers.resetPasswordController),
);
export default authRouter;