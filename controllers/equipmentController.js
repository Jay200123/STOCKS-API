const ErrorHandler = require("../utils/errorHandler");
const SuccessHandler = require("../utils/successHandler");
const asyncHandler = require("express-async-handler");
const equipmentService = require("../services/equipmentService");

exports.getAllEquipments = asyncHandler(async (req, res, next) => {
  const equipments = await equipmentService.getAllEquipmentData();

  return !equipments
    ? next(new ErrorHandler("Equipments not found"))
    : SuccessHandler(
        res,
        `Equipments with
     ${equipments.map((e) => e?.equipment_name).join(",")} with IDs ${equipments
          .map((e) => e?._id)
          .join(",")} retrieved`,
        equipments
      );
});

exports.getOneEquipment = asyncHandler(async (req, res, next) => {
  const equipment = await equipmentService.getOneEquipmentData(req.params.id);

  return !equipment
    ? next(new ErrorHandler("Equipment not Found"))
    : SuccessHandler(
        res,
        `Equipment ${equipment?.equipment_name} with ID ${equipment?._id} retrieved`,
        equipment
      );
});

exports.createEquipment = [
  asyncHandler(async (req, res, next) => {
    const equipment = await equipmentService.createEquipmentData(req);

    return SuccessHandler(
      res,
      `Equipment ${equipment?.equipment_name} with ID ${equipment?._id} successfully retrieved`
    );
  }),
];

exports.updateEquipment = [
  asyncHandler(async (req, res, next) => {
    const equipment = await equipmentService.updateEquipmentData(
      req,
      res,
      req.params?.id
    );

    return SuccessHandler(
      res,
      `Equipment ${equipment?.equipment_name} with ID ${equipment?._id} is updated`,
      equipment
    );
  }),
];

exports.deleteEquipment = asyncHandler(async (req, res, next) => {
  const equipment = await equipmentService.deleteEquipmentData(req.params?.id);

  return !equipment
    ? next(new ErrorHandler("Equipment not found"))
    : SuccessHandler(
        res,
        `Equipment ${equipment?.equipment_name} with ID ${equipment?._id} successfully deleted`,
        equipment
      );
});
