const Transaction = require("../models/transaction");
const Service = require("../models/service");
const Product = require("../models/product");
const Inventory = require("../models/inventory");
const ErrorHandler = require("../utils/errorHandler");
const SuccessHandler = require("../utils/successHandler");
const mongoose = require("mongoose");
const product = require("../models/product");

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
    for (const serviceId of transaction.service) {
      const service = await Service.findById(serviceId).populate({
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
          const restock = await Product.findById(product._id);
          restock.current_volume = product.product_volume;
          restock.quantity - 1;
          restock.save();
        }


        if(productStock.quantity === 0){
          throw new ErrorHandler(`${productStock.product_name} is out of stock`);
        }

        const inventory = await Inventory.create({
          transaction: transaction._id,
          service: transaction.service,
          product: service._id,
          product_consume: product.product_session,
          remained_volume: product.current_volume,
          remained_quantity: product.quantity,
        });
      }
    }
  } catch (err) {
    throw new ErrorHandler(err);
  }
  return transaction;
};
