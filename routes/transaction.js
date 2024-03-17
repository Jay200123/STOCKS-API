const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { METHOD, PATH } = require("../constants/index");

const transactionRoutes = [
    {
        method: METHOD.GET,
        path: PATH.TRANSACTION,
        handler: transactionController.getAllTransactions,
    },
    {
        method: METHOD.POST,
        path: PATH.TRANSACTION,
        handler: transactionController.createTransaction,
    },
]

transactionRoutes.forEach((route)=>{
    const { method, path, handler } = route;
    router[method](path, handler);
});

module.exports = router;