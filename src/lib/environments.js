import "dotenv/config.js";

export default {
  PORT: process.env.PORT || 5005,
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  PAYME_MERCHANT_KEY: process.env.PAYME_MERCHANT_KEY
};
