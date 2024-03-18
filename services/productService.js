const mongoose = require("mongoose");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");

exports.getAllProductsData = async () => {
  const products = await Product.find().sort({ createdAt: -1 }).lean().exec();

  return products;
};

exports.getOneProductData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid Product ID ${id}`);

  const product = await Product.findById(id).lean().exec();

  if (!product) {
    throw new ErrorHandler(`Product not Found with ${id}`);
  }

  return product;
};

exports.createProductData = async (req, res) => {
  const duplicateProduct = await Product.findOne({
    product_name: req.body.product_name,
  })
    .collation({
      locale: "en",
    })
    .lean()
    .exec();

  if (duplicateProduct) throw new ErrorHandler("Error Duplicate product name");

  const product = await Product.create({
    ...req.body,
    current_volume: req.body.product_volume,
  });

  const productMeasurement = req.body.product_volume;
  if (productMeasurement >= 1000) {
    product.measurement = "Liter";
  } else {
    product.measurement = "ml";
  }

  await product.save();

  return product;
};

exports.updateProductData = async (req, res, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid product ID ${id}`);

  const existingProduct = await Product.findById(id).lean().exec();

  if (!existingProduct)
    throw new ErrorHandler(`Product not found with ID ${id}`);

  const duplicateProduct = await Product.findOne({
    product_name: req.body.product_name,
    _id: {
      $ne: id,
    },
  })
    .collation({
      locale: "en",
    })
    .lean()
    .exec();

  if (duplicateProduct) throw new ErrorHandler("Duplicate Product");

  const updateProduct = await Product.findByIdAndUpdate(
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

  if (!updateProduct) throw new ErrorHandler(`Product not found with ID ${id}`);

  return updateProduct;
};

exports.deleteProductData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid product ID ${id}`);

  const product = await Product.findOne({
    _id: id,
  });

  if (!product) throw new ErrorHandler(`Product not Found with ID ${id}`);

  await Promise.all([
    Product.deleteOne({
      _id: id,
    })
      .lean()
      .exec(),
  ]);

  return product;
};
