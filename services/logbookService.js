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
    const newBorrowed = log?.equipment?.map((r) => {
      return r;
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

  const newEquipment = updateLogBook?.equipment?.map((e) => {
    return e;
  });

  for (const equipmentBorrowed of newEquipment) {
    const { equipment, missing_quantity, damage_quantity } = equipmentBorrowed;

    const equipmentId = equipment;
    const newEquipment = await Equipment.findById(equipmentId).lean().exec();

    const { missing_qty, damage_qty } = newEquipment;

    let newMissingQty = missing_quantity + missing_qty;
    let newDamageQty = damage_quantity + damage_qty;

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

    const isMissing = equipmentBorrowed?.status == "Missing";
    const isDamage = equipmentBorrowed?.status == "Damage";
    const isMissingAndDamage = equipmentBorrowed?.status == "Damage && Missing";

    if(isMissing || isDamage || isMissingAndDamage){
      const report = await Report.create({
        user: updateLogBook?.user,
        equipment: equipmentId,
        date_missing: dateToday,
        quantity_missing: newMissingQty,
        damage_quantity: newDamageQty,
      });
    }

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
