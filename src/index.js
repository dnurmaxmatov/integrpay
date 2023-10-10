import express from "express";
import environments from "./lib/environments.js";
import sequelize from "./lib/db.js";

const app=express()
app.use(express.json())

const {PORT}=environments




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