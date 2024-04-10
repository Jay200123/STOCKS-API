const Report = require("../models/report");
const Equipment = require("../models/equipment");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");
const { RESOURCE } = require("../constants/index");

exports.getAllReportsData = async () => {
  const reports = await Report.find()
    .sort({ createdAt: -1 })
    .populate({
      path: RESOURCE.EQUIPMENT,
      select: "equipment_name",
    })
    .lean()
    .exec();

  return reports;
};

exports.getOneReportData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler(`Invalid Report ID: ${id}`);
  }

  const report = await Report.findById(id)
    .populate({
      path: RESOURCE.EQUIPMENT,
      select: "equipment_name",
    })
    .lean()
    .exec();

  if (!report) {
    throw new ErrorHandler(`Report not found with ID: ${id}`);
  }

  return report;
};

exports.createReportData = async (req, res) => {
  const report = await Report.create({
    ...req.body,
  });

  try {
    const { equipment, quantity_missing, damage_quantity, status } = req.body;

    const lossEquipment = await Equipment.findById(equipment).lean().exec();

    let { _id, quantity, missing_qty, damage_qty } = lossEquipment;

    let equipmentQty = 0;
    let missingQty = 0;
    let damageQty = 0;

    const isMissing = status === "Missing";
    if (isMissing) {
      equipmentQty = quantity - quantity_missing;
      missingQty = missing_qty + quantity_missing;
    }

    const isDamage = status === "Damage";
    if (isDamage) {
      equipmentQty = quantity - damage_quantity;
      damageQty = damage_qty + damage_quantity;
    }

    const equipmentStatus = quantity === 0 ? "Not Available" : "Available";

    const updateEquipment = await Equipment.findByIdAndUpdate(_id, {
      quantity: equipmentQty,
      missing_qty: missingQty,
      damage_qty: damageQty,
      status: equipmentStatus,
    });
  } catch (err) {
    throw new ErrorHandler(err);
  }

  return report;
};

exports.updateReportData = async (req, res, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler(`Invalid Report ID ${id}`);
  }

  const report = await Report.findById(id).lean().exec();

  if (!report) {
    throw new ErrorHandler(`Report not Found with ID: ${id}`);
  }

  const updateReport = await Report.findByIdAndUpdate(
    id,
    {
      ...req.body,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  try {
    const { equipment, quantity_found, status, input_qty } = updateReport;

    const reportEquipment = await Equipment.findById(equipment).lean().exec();

    if (!reportEquipment) {
      throw new ErrorHandler(`Equipment not Found with ID: ${equipment}`);
    }

    const { quantity, missing_qty } = reportEquipment;
    console.log(missing_qty);

    if (input_qty > missing_qty) {
      throw new ErrorHandler(
        "Quantity Found should not exceed Missing Quantity"
      );
    }

    let newQuantity = 0;
    let newMissingQty = 0;
    let newFoundQty = 0;

    const isFound = status === "Found" || "Partially Found";
    if (isFound) {
      newQuantity = quantity + input_qty;
      newMissingQty = missing_qty - input_qty;
      newFoundQty = quantity_found + input_qty;
    };

    const isMissing = status === "Missing";
    if(isMissing){
      newQuantity = quantity - input_qty;
      newMissingQty = missing_qty + input_qty;
    };

    const id = equipment;
    const updateEquipment = await Equipment.findByIdAndUpdate(
      id,
      {
        quantity: newQuantity,
        missing_qty: newMissingQty,
        quantity_found: newFoundQty,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    updateReport.quantity_missing = newMissingQty;
    updateReport.quantity_found = newFoundQty;
    updateReport.input_qty = 0; 
    await updateReport.save();

  } catch (err) {
    throw new ErrorHandler(err);
  }

  return updateReport;
};

exports.deleteReportData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler(`Invalid Report ID: ${id}`);
  }

  const report = await Report.findById(id).lean().exec();

  if (!report) {
    throw new ErrorHandler(`Report not Found with ID: ${id}`);
  }

  await Promise.all([
    Report.deleteOne({
      _id: id,
    })
      .lean()
      .exec(),
  ]);

  return report;
};
