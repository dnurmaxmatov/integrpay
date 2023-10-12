import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";

export const Users = sequelize.define("users", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  amount: { type: DataTypes.INTEGER },
  company_id: { type: DataTypes.STRING },
  description: {type: DataTypes.STRING},
  payment_sys: {type: DataTypes.STRING},
  created_at: { type: DataTypes.INTEGER },
  updated_at: { type: DataTypes.INTEGER },
});
