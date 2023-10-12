import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";
import { TransactionState } from "../enums/transaction.enum.js";

export const Transactions = sequelize.define(
  "transactions",
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    company_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [Object.values(TransactionState)],
      },
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    create_time: {
      type: DataTypes.BIGINT,
      defaultValue: Date.now(),
    },
    perform_time: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    cancel_time: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    reason: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
  },
  {
    timestamps: true
  }
);
