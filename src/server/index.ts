import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { environment } from '../config/env';
import { db } from './models';

import postRoutes from './routes/post.routes';
import parsedUserRoutes from './routes/parsedUser.routes';

import { errorHandler } from './middleware/errorHandler';

export const initServer = async () => {
  try {
    // Проверка аутентификации в БД и запуск сервера
    await db.authenticate();

    console.log('Database connection established successfully.');
    await db.sync(); // { force: true } для пересоздания таблиц в development

    const app = express();

    app.use(cors());
    app.use(helmet());
    app.use(morgan('combined'));

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Routes

    app.use('/api/post', postRoutes);
    app.use('/api/parsed-user', parsedUserRoutes);

    // Error handling
    app.use(errorHandler);

    app.listen(environment.PORT, () => {
      console.log(`Server is running on port ${environment.PORT}`);
    });
  } catch (e) {
    console.error('Unable to connect to the database:', e);
  }
};
