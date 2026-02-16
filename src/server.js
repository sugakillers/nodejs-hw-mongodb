import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import { getEnvVar as env} from './utils/getEnvVar.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use(
    pino({
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      }),
  );

  app.use(contactsRouter);

  app.use('*', notFoundHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port`);
  });
};