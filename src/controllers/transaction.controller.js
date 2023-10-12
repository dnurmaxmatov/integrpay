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
        case PaymeMethod.CheckTransaction: {
          await TransactionController.CheckTransaction(req, res, next);
          break;
        }
        case PaymeMethod.CreateTransaction: {
          await TransactionController.createTransaction(req, res, next);
          break;
        }
        case PaymeMethod.PerformTransaction: {
          await TransactionController.PerformTransaction(req, res, next);
          break;
        }
        case PaymeMethod.CancelTransaction: {
          await TransactionController.CancelTransaction(req, res, next);
          break;
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
      if (!company) {
        throw new TransactionError(PaymeError.CompanyNotFound, id);
      }

      amount = Math.floor(amount / 100);
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
      const { account, id, time } = req.body.params;
      let { amount } = req.body.params;
      const subdomain = account.subdomain;

      const company = await Users.findOne({
        where: { subdomain },
      });

      if (!company) {
        throw new TransactionError(PaymeError.CompanyNotFound, id);
      }

      amount = Math.floor(amount / 100);
      if (amount < 1000) {
        throw new TransactionError(PaymeError.InvalidAmount, id);
      }

      let transaction = await Transactions.findOne({
        where: { company_id: company.id, id },
      });

      if (transaction) {
        if (transaction.state !== TransactionState.Pending) {
          throw new TransactionError(PaymeError.CantDoOperation, id);
        }

        const currentTime = Date.now();

        const expirationTime =
          (currentTime - transaction.create_time) / 60000/60 < 12;

        if (!expirationTime) {
          await Transactions.update(
            {
              state: TransactionState.PendingCanceled,
              reason: 4,
            },
            { where: { id } }
          );

          throw new TransactionError(PaymeError.CantDoOperation, id);
        }

        return res.json({
          jsonrpc: "2.0",
          result: {
            transaction: transaction.id,
            state: TransactionState.Pending,
            create_time: +transaction.create_time,
          },
          id,
        });
      }

      transaction = await Transactions.create({
        id: id,
        state: TransactionState.Pending,
        amount,
        company_id: company.id,
        create_time: time,
      });

      return res.json({
        jsonrpc: "2.0",
        result: {
          transaction: transaction.id,
          state: TransactionState.Pending,
          create_time: +transaction.create_time,
        },
        id,
      });
    } catch (err) {
      next(err);
    }
  }

  static async CheckTransaction(req, res, next) {
    try {
      const { params } = req.body;
      const { id } = params;

      const transaction = await Transactions.findOne({ where: { id } });

      if (!transaction) {
        throw new TransactionError(PaymeError.TransactionNotFound, id);
      }

      res.json({
        result: {
          create_time: +transaction.create_time,
          perform_time: +transaction.perform_time,
          cancel_time: +transaction.cancel_time,
          transaction: transaction.id,
          state: transaction.state,
          reason: transaction.reason,
        },
        id,
      });
    } catch (err) {
      next(err);
    }
  }

  static async PerformTransaction(req, res, next) {
    try {
      const { id } = req.body.params;
      const currentTime = Date.now();

      const transaction = await Transactions.findOne({ where: { id } });
      if (!transaction) {
        throw new TransactionError(PaymeError.TransactionNotFound, id);
      }

      if (transaction.state !== TransactionState.Pending) {
        if (transaction.state !== TransactionState.Paid) {
          throw new TransactionError(PaymeError.CantDoOperation, id);
        }

        return res.json({
          result: {
            perform_time: +transaction.perform_time,
            transaction: transaction.id,
            state: TransactionState.Paid,
          },
        });
      }

      const expirationTime =
        (currentTime - transaction.create_time) / 60000 / 60 < 12; // 12m
      if (!expirationTime) {
        await Transactions.update(
          {
            state: TransactionState.PendingCanceled,
            reason: 3,
            cancel_time: currentTime,
          },
          { where: { id } }
        );

        throw new TransactionError(PaymeError.CantDoOperation, id);
      }

      await Transactions.update(
        {
          state: TransactionState.Paid,
          perform_time: currentTime,
        },
        { where: { id } }
      );

      return res.json({
        result: {
          perform_time: currentTime,
          transaction: transaction.id,
          state: TransactionState.Paid,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async CancelTransaction(req,res,next) {
    try {
      const { id, reason } = req.body.params;
      const transaction = await Transactions.findOne({where: {id}});
      if (!transaction) {
        throw new TransactionError(PaymeError.TransactionNotFound, id);
      }
  
      const currentTime = Date.now();
  
      if (transaction.state > 0) {
        await Transactions.update({
          state: -Math.abs(transaction.state),
          reason,
          cancel_time: currentTime,
        }, {where: {id}});
      }
  
      return res.json ({
        result: {
          cancel_time: +transaction.cancel_time || currentTime,
          transaction: transaction.id,
          state: -Math.abs(transaction.state),
        }
      });
    } catch (error) {
        next(error)
    };
    
  }
}
