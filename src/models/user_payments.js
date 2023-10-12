import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";

export const UsersPayments = sequelize.define("user_payments", {
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
