import { Users } from "../models/users.js";
import { Transactions } from "../models/transactions.js";

import { PaymeMethod } from "../enums/transaction.enum.js";

import {
  PaymeError,
  PaymeData,
  TransactionState,
} from "../enums/transaction.enum.js";

import TransactionError from "../errors/transaction.error.js";

export default class TransactionController {
  static async payme(req, res, next) {
    const { method } = req.body;
    try {
      switch (method) {
        case PaymeMethod.CheckPerformTransaction: {
          await TransactionController.checkPerformTransaction(req, res, next);
          break;
        }
        // case PaymeMethod.CheckTransaction: {
        //   const result = await TransactionController.checkTransaction(
        //     req,
        //     res,
        //     next
        //   );

        //   return res.json({ result, id });
        // }
        case PaymeMethod.CreateTransaction: {
          await TransactionController.createTransaction(req, res, next);
          break;
        }
        case PaymeMethod.PerformTransaction: {
          const result = await this.performTransaction(params, id);

          return res.json({ result, id });
        }
        case PaymeMethod.CancelTransaction: {
          const result = await this.cancelTransaction(params, id);

          return res.json({ result, id });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async checkPerformTransaction(req, res, next) {
    try {
      let { amount } = req.body.params;
      const { subdomain } = req.body.params.account;
      const { id } = req.body;
      const company = await Users.findOne({
        where: { subdomain },
      });

      amount = Math.floor(amount / 100);

      if (!company) {
        throw new TransactionError(PaymeError.CompanyNotFound, id);
      }

      if (amount < 1000) {
        throw new TransactionError(PaymeError.InvalidAmount, id);
      }

      return res.json({
        result: {
          allow: true,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async createTransaction(req, res, next) {
    try {
      const {account, id, time}=req.body.params
      let amount=req.body.params

      const transaction=await Transactions.findOne({where: {id}})
      if(transaction){
        
      }
    } catch (err) {
      next(err);
    }
  }
}
