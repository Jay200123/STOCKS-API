const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { METHOD, PATH } = require("../constants/index");

const userRoutes = [
    {
        method:METHOD.GET,
        path:PATH.USER,
        handler:userController.getAllUsers,
    },
    {
        method: METHOD.POST,
        path: PATH.USER,
        handler: userController.createUser,
    },
];

userRoutes.forEach((route)=>{
    const { method, path, handler } = route;
    router[method](path, handler); 
});

module.exports = router;