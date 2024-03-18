const express = require("express");
const router = express.Router();
const { METHOD, PATH } = require("../constants/index"); 
const inventoryController = require("../controllers/inventoryController");

const inventoryRouter = [
    {
        method: METHOD.GET,
        path: PATH.INVENTORY,
        handler: inventoryController.getAllInventory,
    }
];

inventoryRouter.forEach((route)=>{
    const { method, path, handler } = route;
    router[method](path, handler);
});

module.exports = router;