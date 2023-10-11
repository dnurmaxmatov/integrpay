import express from "express"


import transactionController from "../controllers/transaction.controller.js"

import { paymeCheckToken } from "../middlewares/transaction.middleware.js"

const router = express.Router();

router.post("/payme", paymeCheckToken, transactionController.payme);

export default router;
