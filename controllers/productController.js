const productService = require("../services/productService");
const ErrorHandler = require("../utils/errorHandler");
const SuccessHandler = require("../utils/successHandler");
const asyncHandler = require("express-async-handler");

exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await productService.getAllProductsData();
  return !products
    ? next(new ErrorHandler("Products not Found"))
    : SuccessHandler(res, `Products Found`, products);
});

exports.getOneProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.getOneProductData(req.params.id);

  return !product
    ? next(new ErrorHandler("Product not found"))
    : SuccessHandler(
        res,
        `Product with product name ${product?.product_name} with ID ${product?._id} retrieved`,
        product
      );
});

exports.createNewProduct = [
  asyncHandler(async (req, res, next) => {
    const product = await productService.createProductData(req);
    return SuccessHandler(
      res,
      `Created new product ${product?.product_name} with ID ${product?._id}`,
      product
    );
  }),
];

exports.updateProduct = [
  asyncHandler(async (req, res, next) => {
    const product = await productService.updateProductData(
      req,
      res,
      req.params.id
    );

    return SuccessHandler(
      res,
      `Product ${product?.product_name} with ID ${product?._id} successfully updated`,
      product
    );
  }),
];

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.deleteProductData(req.params.id);

  return !product
    ? next(new ErrorHandler("No products found"))
    : SuccessHandler(
        res,
        `Product ${product?.product_name} with ID ${product?._id} successfully deleted`,
        product
      );
});
