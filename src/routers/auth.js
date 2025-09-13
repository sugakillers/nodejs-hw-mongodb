import { Router } from 'express';
import * as authControllers from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authRegisterSchema, authLoginSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const authRouter = Router();
authRouter.post(
  '/register',
  validateBody(authRegisterSchema),
  ctrlWrapper(authControllers.registerController),
);
authRouter.post(
  '/login',
  validateBody(authLoginSchema),
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

export default authRouter;