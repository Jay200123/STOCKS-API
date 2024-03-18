const Transaction = require("../models/transaction");
const Service = require("../models/service");
const Product = require("../models/product");
const Inventory = require("../models/inventory");
const ErrorHandler = require("../utils/errorHandler");

exports.getAllTransactionData = async () => {
  const transaction = await Transaction.find()
    .collation({ locale: "en" })
    .lean()
    .exec();

  return transaction;
};

exports.createTransactionData = async (req, res) => {
  const transaction = await Transaction.create({
    ...req.body,
  });

  try {
    const serviceIds = transaction.service;

    const serviceCount = await Service.find({ _id: { $in: serviceIds } })
      .lean()
      .exec();

    if (serviceCount.length !== serviceIds.length) {
      throw new ErrorHandler(`No services were found`);
    }

    for (const serviceId of serviceCount) {
      const services = serviceId?._id;

      const service = await Service.findById(services).populate({
        path: "product",
        select:
          "_id product_name current_volume product_session product_volume quantity",
      });

      if (!service) {
        throw new ErrorHandler(`Service not found`);
      }

      for (const product of service.product) {
        const newVolume = product.current_volume - product.product_session;

        const productStock = await Product.findByIdAndUpdate(
          product._id,
          {
            current_volume: newVolume,
          },
          {
            new: true,
          }
        );

        if (productStock.current_volume === 0) {
          productStock.current_volume = product.product_volume;
          productStock.quantity -= 1;
          await productStock.save();
        }

        if(productStock.current_volume < 1000){
          productStock.measurement = "ml"
        }else{
          productStock.measurement = "Liter"
        }
        await productStock.save();

        if (productStock.quantity === 0) {
          throw new ErrorHandler(
            `${productStock.product_name} is out of stock`
          );
        }

        const inventory = await Inventory.create({
          transaction: transaction._id,
          service: service._id,
          product: product._id,
          product_consume: product.product_session,
          remained_volume: newVolume,
          remained_quantity: productStock.quantity,
        });
      }
    }
  } catch (err) {
    throw new ErrorHandler(err);
  }
  return transaction;
};
