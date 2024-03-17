const transactionService = require("../services/transactionService");
const SuccessHandler = require("../utils/successHandler");
const asyncHandler = require("express-async-handler");

exports.getAllTransactions = asyncHandler(async (req, res, next) => {
    const transactions = await transactionService.getAllTransactionData();
    return !transactions
      ? next(new ErrorHandler("transactions not Found"))
      : SuccessHandler(res, `transactions Found`, transactions);
  });

exports.createTransaction = [
    asyncHandler((req, res, next)=>{
        const transaction = transactionService.createTransactionData(req);
        return SuccessHandler(res, `Transaction Successfully Created`, transaction);
    })
];