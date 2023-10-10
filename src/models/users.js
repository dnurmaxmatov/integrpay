import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const Users = sequelize.define("users", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING },
  created_at: { type: DataTypes.INTEGER },
  updated_at: { type: DataTypes.INTEGER },
});
