const transactionService = require("../services/transactionService");
const ErrorHandler = require("../utils/errorHandler");
const SuccessHandler = require("../utils/successHandler");
const asyncHandler = require("express-async-handler");

exports.createTransaction = [
    asyncHandler((req, res, next)=>{
        const transaction = transactionService.createTransactionData(req);
        return SuccessHandler(res, `Transaction Successfully Updated`, transaction);
    })
];