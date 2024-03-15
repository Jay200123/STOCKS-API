const deliveryService = require("../services/deliveryService");
const ErrorHandler = require("../utils/errorHandler");
const SuccessHandler = require("../utils/successHandler");
const asyncHandler = require("express-async-handler");

exports.getAllDeliveries = asyncHandler(async (req, res, next) => {
  const deliveries = await deliveryService.getAllDeliveryData();
  return !deliveries
    ? next(new ErrorHandler("deliveries not Found"))
    : SuccessHandler(res, `deliveries Found`, deliveries);
});

exports.getOneDelivery = asyncHandler(async (req, res, next) => {
  const delivery = await deliveryService.getOneDeliveryData(req.params.id);

  return !delivery
    ? next(new ErrorHandler("Delivery not found"))
    : SuccessHandler(
        res,
        `Delivery with company ${delivery?.company_name} with delivery ID ${delivery?._id} retrieved`,
        delivery
      );
});

exports.createNewDelivery = [
  asyncHandler(async (req, res, next) => {
    const delivery = await deliveryService.createDeliveryData(req);
    return SuccessHandler(
      res,
      `Created new delivery ${delivery?.company_name} with ID ${delivery?._id}`,
      delivery
    );
  }),
];

exports.updateDelivery = [
  asyncHandler(async (req, res, next) => {
    const delivery = await deliveryService.updateDeliveryData(
      req,
      res,
      req.params.id
    );

    return SuccessHandler(
      res,
      `Delivery ${delivery?.company_name} with ID ${delivery?._id} successfully updated`,
      delivery
    );
  }),
];

exports.deleteDelivery = asyncHandler(async (req, res, next) => {
  const delivery = await deliveryService.deleteDeliveryData(req.params.id);

  return !delivery
    ? next(new ErrorHandler("No delivery found"))
    : SuccessHandler(
        res,
        `Delivery ${delivery?.company_name} with ID ${delivery?._id} successfully deleted`,
        delivery
      );
});
