import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";
import { TransactionState } from "../enums/transaction.enum.js";

export const Transactions = sequelize.define("transactions", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    required: true
  },
  company_id: {
    type: DataTypes.UUID,
    required: true,
  },
  state: {
    type: DataTypes.STRING,
    required: true,
  },
  amount: {
    type: DataTypes.BIGINT,
    required: true,
  },
  create_time: {
    type: DataTypes.BIGINT,
    default: Date.now(),
  },
  perform_time: {
    type: DataTypes.BIGINT,
    default: 0,
  },
  cancel_time: {
    type: DataTypes.BIGINT,
    default: 0,
  },
  reason: {
    type: DataTypes.INTEGER,
    default: null,
  },
});
