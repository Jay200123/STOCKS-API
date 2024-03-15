const serviceServices = require("../services/serviceServices");
const ErrorHandler = require("../utils/errorHandler");
const SuccessHandler = require("../utils/successHandler");
const asyncHandler = require("express-async-handler");

exports.getAllService = asyncHandler(async (req, res, next) => {
  const services = await serviceServices.getAllServicesData();
  return !services
    ? next(new ErrorHandler("Service not Found"))
    : SuccessHandler(res, `Service Found`, services);
});

exports.getOneService = asyncHandler(async (req, res, next) => {
  const service = await serviceServices.getOneServiceData(req.params.id);

  return !service
    ? next(new ErrorHandler("Service not found"))
    : SuccessHandler(
        res,
        `Service with service name ${service?.service_name} with ID ${service?._id} retrieved`,
        service
      );
});

exports.createNewService = [
  asyncHandler(async (req, res, next) => {
    const service = await serviceServices.createServiceData(req);
    return SuccessHandler(
      res,
      `Created new service ${service?.service_name} with ID ${service?._id}`,
      service
    );
  }),
];

exports.updateService = [
  asyncHandler(async (req, res, next) => {
    const service = await serviceServices.updateServiceData(
      req,
      res,
      req.params.id
    );

    return SuccessHandler(
      res,
      `Service ${service?.service_name} with ID ${service?._id} successfully updated`,
      service
    );
  }),
];

exports.deleteService = asyncHandler(async (req, res, next) => {
  const service = await serviceServices.deleteServiceData(req.params.id);

  return !service
    ? next(new ErrorHandler("No Service found"))
    : SuccessHandler(
        res,
        `Service ${service?.service_name} with ID ${service?._id} successfully deleted`,
        service
      );
});
