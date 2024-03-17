const mongoose = require("mongoose");
const Delivery = require("../models/delivery");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");

exports.getAllDeliveryData =  async ()=>{
    const delivery = await Delivery.find()
    .sort({ createdAt: -1})
    .lean()
    .exec();
    
    return delivery;
};

exports.getOneDeliveryData = async (id) =>{
    if(!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Delivery ID ${id}`);

    const delivery = await Delivery.findById(id).lean().exec();

    if(!delivery){
        throw new ErrorHandler(`Delivery not Found with ${id}`);
    };

    return delivery;
}

exports.createDeliveryData = async(req, res)=>{
    const delivery = await Delivery.create({
        ...req.body,
    });

    const product = await Product.findById(req.body.product);
    product.quantity += req.body.quantity;
    await product.save();

    return delivery;
};

exports.updateDeliveryData = async (req, res, id)=>{
    if(!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid delivery ID ${id}`)

    const existingCompany = await Delivery.findById(id).lean().exec();

    if(!existingCompany) throw new ErrorHandler(`Delivery not found with ID ${id}`)

    const duplicateDelivery = await Delivery.findOne({
        company_name: req.body.company_name,
        _id: {
            $ne:id,
        },
    })
    .collation({
        locale:"en",
    })
    .lean()
    .exec()

    if(duplicateDelivery) throw new ErrorHandler("Duplicate Company name");

    const updateDelivery = await Delivery.findByIdAndUpdate(
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

    if(!updateDelivery) throw new ErrorHandler(`Delivery not found with ID ${id}`);

    return updateDelivery;
}

exports.deleteDeliveryData = async(id)=>{
    if(!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid delivery ID ${id}`)

    const delivery = await Delivery.findOne({
        _id:id,
    });

    if(!delivery) throw new ErrorHandler(`Delivery not Found with ID ${id}`);

    await Promise.all([
        Delivery.deleteOne({
            _id:id,
        })
        .lean()
        .exec()
    ]);

    return delivery;
}