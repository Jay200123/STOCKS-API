const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { METHOD, PATH } = require("../constants/index");

const serviceRoutes = [
    {
        method: METHOD.GET,
        path: PATH.SERVICES,
        handler: serviceController.getAllService,
    },
    {
        method: METHOD.GET,
        path: PATH.SERVICE_ID,
        handler: serviceController.getOneService,
    },
    {
        method: METHOD.POST,
        path: PATH.SERVICES,
        handler: serviceController.createNewService,
    },
    {
        method: METHOD.PATCH,
        path: PATH.SERVICE_EDIT_ID,
        handler: serviceController.updateService,
    },
    {
        method: METHOD.DELETE,
        path: PATH.SERVICE_ID,
        handler: serviceController.deleteService,
    }
];

serviceRoutes.forEach((route)=>{
    const { method, path, handler } = route;
    router[method](path, handler);
});

module.exports = router;