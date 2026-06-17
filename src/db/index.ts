import { Sequelize } from 'sequelize';
import { environment } from '../config/env';

export const db = new Sequelize(environment.DB_NAME, environment.DB_USER, environment.DB_PASSWORD, {
  host: environment.DB_HOST,
  dialect: 'mysql',
  port: environment.DB_PORT,
  logging: environment.NODE_ENV === 'development' ? console.log : false,
});
