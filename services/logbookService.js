const LogBook = require("../models/logbook");
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
      path: RESOURCE.EQUIPMENT,
      select: "equipment_name",
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

  return log;
};

exports.updateLogsData = async (req, res, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler(`Invalid LogBook ID`);
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

  const updateLogBook = await LogBook.findByIdAndUpdate(
    id,
    {
      ...req.body,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();

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
