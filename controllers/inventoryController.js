const ErrorHandler = require("../utils/errorHandler");
const SuccessHandler = require("../utils/successHandler");
const asyncHandler = require("express-async-handler");
const inventoryService = require("../services/inventoryService");

exports.getAllInventory = asyncHandler(async(req, res, next)=>{
    const inventories = await inventoryService.getAllInventoryData();

    return !inventories
    ? next(new ErrorHandler("Inventory data not Found"))
    : SuccessHandler(res, `Inventory Data Successfully retrieved`, inventories);
});
