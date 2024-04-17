const Transaction = require("../models/transaction");
const Service = require("../models/service");
const Product = require("../models/product");
const Inventory = require("../models/inventory");
const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const { RESOURCE } = require("../constants/index");

exports.getAllTransactionData = async () => {
  const transaction = await Transaction.find()
    .populate({
      path: RESOURCE.SERVICE,
      select: "service_name type"
    })
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
        let consumeSession = product.product_session;

        const isLongHair =
          description?.includes("Long Hair") && service?.type?.includes("Hair");

        let newVolume;

        if (isLongHair) {
          const long_vol = product.product_volume * 0.2;
          consumeSession = long_vol;
          newVolume = product.current_volume - long_vol;
        } else {
          newVolume = product.current_volume - consumeSession;
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

        let restock;
        let reducedQuantity = product.quantity;
        let usedQty = 0;
        let emptyVolume = newVolume - consumeSession;

        const isEmpty = emptyVolume === 0;
        if (isEmpty) {
          restock = productStock.current_volume = productStock.product_volume;
          reducedQuantity = productStock.quantity -= 1;
          usedQty = 1;
        }

        const isLeft = consumeSession > newVolume;
        if (isLeft) {
          restock = productStock.current_volume = productStock.product_volume;
          reducedQuantity = productStock.quantity -= 1;
          usedQty = 1;
          const leftVolume = consumeSession * 0.5;
          newVolume = productStock.current_volume - leftVolume;
        }

        const isMeasured = productStock.current_volume < 1000;
        if (isMeasured) {
          productStock.measurement = "ml";
        } else {
          productStock.measurement = "Liter";
        }

        await productStock.save();

        const outStock = productStock.quantity === 0;
        if (outStock) {
          throw new ErrorHandler(
            `${productStock.product_name} is out of stock`
          );
        }

        const inventory = await Inventory.create({
          transaction: transaction._id,
          service: service._id,
          product: product._id,
          product_consume: consumeSession,
          old_volume: product.current_volume,
          remained_volume: newVolume,
          old_quantity: product.quantity,
          remained_quantity: reducedQuantity,
          used_quantity: usedQty,
        });
      }
    }
  } catch (err) {
    throw new ErrorHandler(err);
  }
  return transaction;
};
