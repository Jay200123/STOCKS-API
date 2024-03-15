const mongoose = require("mongoose");
const express = require("express");
const deliveryController = require("../controllers/deliveryController");
const { METHOD, PATH } = require("../constants/index");

const router = express.Router();

const deliveryRoutes = [
    {
        method: METHOD.GET,
        path: PATH.DELIVERIES,
        handler: deliveryController.getAllDeliveries,
    },
    {
        method: METHOD.GET,
        path: PATH.DELIVERY_ID,
        handler: deliveryController.getOneDelivery,
    },
    {
        method: METHOD.POST,
        path: PATH.DELIVERIES,
        handler: deliveryController.createNewDelivery,
    },
    {
        method: METHOD.PATCH,
        path: PATH.DELIVERY_EDIT_ID,
        handler: deliveryController.updateDelivery,
    },
    {
        method: METHOD.DELETE,
        path: PATH.DELIVERY_ID,
        handler: deliveryController.deleteDelivery,
    }
]

deliveryRoutes.forEach((route)=>{
    const { method, path, handler} = route;
    router[method](path, handler);
});

module.exports = router;