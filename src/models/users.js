import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";

export const Users = sequelize.define("users", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING },
  subdomain: {type: DataTypes.STRING},
  balance: {type: DataTypes.BIGINT, defaultValue: 0},
  created_at: { type: DataTypes.INTEGER },
  updated_at: { type: DataTypes.INTEGER },
});
