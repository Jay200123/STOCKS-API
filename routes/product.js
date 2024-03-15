const express = require('express');
const router = express.Router();
const productController = require("../controllers/productController");
const { PATH, METHOD } = require("../constants/index");

const productRouter = [
    {
        method: METHOD.GET,
        path: PATH.PRODUCTS,
        handler: productController.getAllProducts,
    },
    {
        method: METHOD.GET,
        path: PATH.PRODUCT_ID,
        handler: productController.getOneProduct,
    },
    {
        method: METHOD.POST,
        path: PATH.PRODUCTS,
        handler: productController.createNewProduct,
    },
    {
        method: METHOD.PATCH,
        path: PATH.PRODUCT_EDIT_ID,
        handler: productController.updateProduct,
    },
    {
        method: METHOD.DELETE,
        path: PATH.PRODUCT_ID,
        handler: productController.deleteProduct,
    }
]

productRouter.forEach((route)=>{
    const { method, path, handler } = route;
    router[method](path, handler);
});

module.exports = router;