const Equipment = require("../models/equipment");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandler");

exports.getAllEquipmentData = async () => {
  const equipment = await Equipment.find()
    .collation({ locale: "en" })
    .lean()
    .exec();

  return equipment;
};

exports.getOneEquipmentData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ErrorHandler(`Invalid equipment ID ${id}`);
  }

  const equipment = await Equipment.findById(id).lean().exec();

  if (!equipment) {
    throw new ErrorHandler(`Equipment not found with ID ${equipment}`);
  }

  return equipment;
};

exports.createEquipmentData = async (req, res) => {
  const duplicateEquipment = await Equipment.findOne({
    equipment_name: req.body.equipment_name,
  })
    .lean()
    .exec();

  if (duplicateEquipment) {
    throw new ErrorHandler(`Duplicate Equipment`);
  }

  const equipment = await Equipment.create({
    ...req.body,
  });

  return equipment;
};

exports.updateEquipmentData = async (req, res, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Equipment ID ${id}`);

  const existingEquipment = await Equipment.findById(id).lean().exec();

  if (!existingEquipment)
    throw new ErrorHandler(`Equipment not Found with ID ${id}`);

  const duplicateEquipment = await Equipment.findOne({
    equipment_name: req.body.equipment_name,
    _id: {
      $ne: id,
    },
  })
    .collation({
      locale: "en",
    })
    .lean()
    .exec();

  if (duplicateEquipment) throw new ErrorHandler("Duplicate Equipment");

  const updateEquipment = await Equipment.findByIdAndUpdate(
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

  return updateEquipment;
};

exports.deleteEquipmentData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Equipment ID ${id}`);

  const equipment = await Equipment.findOne({
    _id: id,
  });

  if (!equipment) throw new ErrorHandler(`Equipment not found with ID ${id}`);

  await Promise.all([
    Equipment.deleteOne({
      _id: id,
    })
      .lean()
      .exec(),
  ]);

  return equipment;
};
