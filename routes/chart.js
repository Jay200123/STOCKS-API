const express = require("express");
const router = express.Router();
const { METHOD, PATH } = require("../constants/index");
const chartController = require("../controllers/chartController");

const chartRouter = [
  {
    method: METHOD.GET,
    path: PATH.TYPE_CHARTS,
    handler: chartController.getTypes,
  },
];

chartRouter.forEach((route) => {
  const { method, path, handler } = route;
  router[method](path, handler);
});

module.exports = router;
