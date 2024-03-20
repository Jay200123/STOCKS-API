const Equipment = require("../models/equipment");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandler");

exports.getAllEquipmentData = async()=>{
    const equipment = await Equipment.find()
    .collation({ locale:"en" })
    .lean()
    .exec()

    return equipment;
};

exports.getOneEquipment = async(id)=>{
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ErrorHandler(`Invalid equipment ID ${id}`)
    }

    const equipment = await Equipment.findById(id)
    .lean()
    .exec()

    if(!equipment){
        throw new ErrorHandler(`Equipment not found with ID ${equipment}`)
    }

    return equipment;
}

exports.createEquipment = async(req, res)=>{
    const duplicateEquipment = await Equipment.findOne({
        equipment_name: req.body.equipment_name,
    })
    .lean()
    .exec()

    if(duplicateEquipment){
        throw new ErrorHandler(`Duplicate Equipment`)
    }

   const equipment = await Equipment.create({
    ...req.body
   });

   return equipment;
}
