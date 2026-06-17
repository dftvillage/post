export const environment = {
  NODE_ENV: process.env.NODE_ENV as string,
  OUTPUT_DIR: process.env.OUTPUT_DIR as string,
  MEDIA_DIR: process.env.MEDIA_DIR as string,
  HUB_ID: +(process.env.HUB_ID as string),
  PUBLIC_ID: +(process.env.PUBLIC_ID as string),
  DB_HOST: process.env.DB_HOST as string,
  DB_PORT: +(process.env.DB_PORT as string),
  DB_NAME: process.env.DB_NAME as string,
  DB_USER: process.env.DB_USER as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,
  HOST: process.env.HOST as string,
  PORT: process.env.PORT as string,

  USERBOT_API_ID: +(process.env.USERBOT_API_ID as string),
  USERBOT_API_HASH: process.env.USERBOT_API_HASH as string,
  USERBOT_API_SESSION: process.env.USERBOT_API_SESSION as string,

  USERBOT_2_API_ID: +(process.env.USERBOT_2_API_ID as string),
  USERBOT_2_API_HASH: process.env.USERBOT_2_API_HASH as string,
  USERBOT_2_API_SESSION: process.env.USERBOT_2_API_SESSION as string,
};
