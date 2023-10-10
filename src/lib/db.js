/* eslint-disable no-param-reassign */
import { Sequelize } from "sequelize";
import environments from "./environments.js";

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT } = environments;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  dialect: "postgres",
  logging: false,
  host: DB_HOST,
  port: DB_PORT,
  define: {
    timestamps: false,
    hooks: {
      beforeCreate: (model) => {
        model.dataValues.created_at = Math.floor(Date.now() / 1000);
        model.dataValues.updated_at = Math.floor(Date.now() / 1000);
      },
      beforeUpdate: (model) => {
        model.dataValues.updated_at = Math.floor(Date.now() / 1000);
      },
    },
  },
});


export default sequelize;
