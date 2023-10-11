import express from "express";
import environments from "./lib/environments.js";
import sequelize from "./lib/db.js";
import routes from './routes/index.js'
import errorHandler from "./middlewares/error-handler.middleware.js";
import cors from 'cors'

const app=express()

const {PORT}=environments

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(routes)
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Connection has been established successfully.");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();