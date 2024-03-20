const Transaction = require("../models/transaction");
const Service = require("../models/service");
const Product = require("../models/product");
const Inventory = require("../models/inventory");
const User = require("../models/user");
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

      const service = await Service.findById(services)
        .populate({
          path: "product",
          select:
            "_id product_name current_volume product_session product_volume quantity",
        })
        .collation({ locale: "en" })
        .lean()
        .exec();

      if (!service) {
        throw new ErrorHandler(`Service not found`);
      }

      for (const product of service.product) {
        const transacId = transaction?._id;
        const customer = await Transaction.findById(transacId)
          .populate({
            path: "user",
            select: "name description",
          })
          .collation({ locale: "en" })
          .lean()
          .exec();

        const description = customer?.user?.description;
        let newVolume = product.current_volume - product.product_session;
        let consumeSession = product?.product_session;

        if (
          description?.includes("Long Hair") &&
          service?.type?.includes("Hair")
        ) {
          let long_vol = product.product_volume * 0.2;
          consumeSession = long_vol;
          newVolume = product.current_volume - long_vol;
        } else if (
          description?.includes("Short Hair") &&
          service?.type?.includes("Hair")
        ) {
          let short_vol = (product.product_volume * 0.5) / 10;
          consumeSession = short_vol;
          newVolume = product.current_volume - short_vol;
        }

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

        if (productStock.current_volume < 1000) {
          productStock.measurement = "ml";
        } else {
          productStock.measurement = "Liter";
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
          product_consume: consumeSession,
          remained_volume: newVolume,
          remained_quantity: productStock.quantity,
        });

        console.log(inventory);
      }
    }
  } catch (err) {
    throw new ErrorHandler(err);
  }
  return transaction;
};
