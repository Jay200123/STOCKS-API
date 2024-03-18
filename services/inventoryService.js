const Inventory = require("../models/inventory");
const { RESOURCE } = require("../constants/index");

exports.getAllInventoryData = async()=>{
    const inventories = await Inventory.find()
    .sort({ createdAt: -1})
    .populate({
        path: RESOURCE.SERVICE,
        select:"service_name"
    })
    .populate({
        path: RESOURCE.PRODUCT,
        select: "product_name"
    })
    .lean()
    .exec()

    return inventories;
}

exports.deleteAllInventory = async()=>{
    const inventory = await Inventory.deleteMany({})
    return inventory;
}