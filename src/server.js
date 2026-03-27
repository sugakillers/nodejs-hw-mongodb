import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import { getEnvVar as env} from './utils/getEnvVar.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import authRouter from './routers/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.use(
    pino({
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      }),
  );

  const swaggerDocument = YAML.load(path.resolve(__dirname, '../swagger/bundle.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port`);
    console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
  });
};