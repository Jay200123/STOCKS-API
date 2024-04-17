const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const AsyncHandler = require("express-async-handler");
const chartService = require("../services/chartService");

exports.getTypes = AsyncHandler(async(req, res, next)=>{
    const charts =  await chartService.getAllServiceTypesData();

    return !charts
    ? next(new ErrorHandler("Charts Not Found"))
    : SuccessHandler(res,"Charts Found!", charts)
});