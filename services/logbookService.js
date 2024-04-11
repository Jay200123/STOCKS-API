const LogBook = require("../models/logbook");
const Equipment = require("../models/equipment");
const Report = require("../models/report");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandler");
const { RESOURCE } = require("../constants/index");

exports.getAllLogsData = async () => {
  const logs = await LogBook.find()
    .populate({
      path: RESOURCE.USER,
      select: "name",
    })
    .populate({
      path: "equipment",
      populate: {
        path: "equipment",
        select: "equipment_name",
      },
    })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return logs;
};

exports.getOneLogData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler(`Invalid Logs ID ${id}`);
  }

  const log = await LogBook.findById(id)
    .populate({
      path: RESOURCE.EQUIPMENT,
      select: "equipment_name",
    })
    .populate({
      path: RESOURCE.USER,
      select: "name",
    })
    .lean()
    .exec();

  return log;
};

exports.createLogsData = async (req, res) => {
  const log = await LogBook.create({
    ...req.body,
  });

  try {
    const newBorrowed = log?.equipment?.map((equipment) => {
      return equipment;
    });

    for (const equipment of newBorrowed) {
      const equipmentId = equipment?.equipment;
      const borrowedQty = equipment?.borrow_quantity;

      const borrowedEquipment = await Equipment.findById(equipmentId);

      let { quantity } = borrowedEquipment;

      let newQuantity = quantity - borrowedQty;
      borrowedEquipment.quantity = newQuantity;
      await borrowedEquipment.save();
    }
  } catch (err) {
    throw new ErrorHandler(err);
  }

  return log;
};

exports.updateLogsData = async (req, res, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler(`Invalid LogBook ID:${id}`);
  }

  const existingLogBook = await LogBook.findById(id)
    .populate({
      path: RESOURCE.USER,
      select: "name",
    })
    .lean()
    .exec();

  if (!existingLogBook) {
    throw new ErrorHandler(`Logbook not found with ID ${id}`);
  }

  const dateToday = new Date();

  const updateLogBook = await LogBook.findByIdAndUpdate(
    id,
    {
      ...req.body,
      date_returned: dateToday,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();

  try {
    const newEquipment = updateLogBook?.equipment?.map((equipment) => {
      return equipment;
    });

    for (const equipmentBorrowed of newEquipment) {
      const {
        equipment,
        borrow_quantity,
        missing_quantity,
        damage_quantity,
        status,
      } = equipmentBorrowed;

      if (
        missing_quantity > borrow_quantity ||
        damage_quantity > borrow_quantity
      ) {
        throw new ErrorHandler(
          "Missing or damage quantity cannot exceed borrow quantity"
        );
      }

      const equipmentId = equipment;
      const newEquipment = await Equipment.findById(equipmentId).lean().exec();

      let { missing_qty, damage_qty } = newEquipment;

      let newMissingQty = (missing_qty = missing_quantity);
      let newDamageQty = (damage_qty = damage_quantity);

      const updateEquipment = await Equipment.findByIdAndUpdate(
        equipmentId,
        {
          missing_qty: newMissingQty,
          damage_qty: newDamageQty,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      const isMissing = status === "Missing" && missing_quantity >= 1;
      const isDamage = status === "Damage" && damage_quantity >= 1;
      const isMissingAndDamage =
        status === "Damage && Missing" &&
        missing_quantity >= 1 &&
        damage_quantity >= 1;

      const insertDate = isMissing || isMissingAndDamage ? dateToday : "";

      let statusReport = "";

      if(isMissing){
        statusReport = "Missing";
      }else if(isDamage){
        statusReport = "Damage"
      }else if(isMissingAndDamage){
        statusReport = "Missing & Damage"
      }

      if (isMissing || isDamage || isMissingAndDamage) {
        const report = await Report.create({
          user: updateLogBook?.user,
          equipment: equipmentId,
          date_missing: insertDate,
          quantity_missing: newMissingQty,
          damage_quantity: newDamageQty,
          status: statusReport,
        });
      }
    }
  } catch (err) {
    throw new ErrorHandler(err);
  }
  return updateLogBook;
};

exports.deleteLogBookData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler(`Invalid LogBook ID ${id}`);
  }

  const logbook = await LogBook.findById(id)
    .populate({
      path: RESOURCE.USER,
      select: "name",
    })
    .lean()
    .exec();

  if (!logbook) {
    throw new ErrorHandler(`LogBook not found with ID ${id}`);
  }

  await Promise.all([
    LogBook.deleteOne({
      _id: id,
    })
      .lean()
      .exec(),
  ]);

  return logbook;
};
