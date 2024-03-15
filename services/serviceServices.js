const mongoose = require("mongoose");
const Service = require("../models/service");
const ErrorHandler = require("../utils/errorHandler");

exports.getAllServicesData =  async ()=>{
    const services = await Service.find()
    .sort({ createdAt: -1})
    .lean()
    .exec();
    
    return services;
};

exports.getOneServiceData = async (id) =>{
    if(!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Service ID ${id}`);

    const service = await Service.findById(id).lean().exec();

    if(!service){
        throw new ErrorHandler(`Service not Found with ${id}`);
    };

    return service;
}

exports.createServiceData = async(req, res)=>{
    const duplicateService = await Service.findOne({
        service_name: req.body.service_name,
    })
    .collation({
        locale:"en",
    })
    .lean()
    .exec()

    if(duplicateService) throw new ErrorHandler("Error Duplicate Service name");

    const service = await Service.create({
        ...req.body,
    });

    return service;
};

exports.updateServiceData = async (req, res, id)=>{
    if(!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Service ID ${id}`)

    const existingService = await Service.findById(id).lean().exec();

    if(!existingService) throw new ErrorHandler(`Service not found with ID ${id}`)

    const duplicateService = await Service.findOne({
        service_name: req.body.service_name,
        _id: {
            $ne:id,
        },
    })
    .collation({
        locale:"en",
    })
    .lean()
    .exec()

    if(duplicateService) throw new ErrorHandler("Duplicate Service");

    const updateService = await Service.findByIdAndUpdate(
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

    if(!updateService) throw new ErrorHandler(`Service not found with ID ${id}`);

    return updateService;
}

exports.deleteServiceData = async(id)=>{
    if(!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Service ID ${id}`)

    const service = await Service.findOne({
        _id:id,
    });

    if(!service) throw new ErrorHandler(`Service not Found with ID ${id}`);

    await Promise.all([
        Service.deleteOne({
            _id:id,
        })
        .lean()
        .exec()
    ]);

    return service;
}