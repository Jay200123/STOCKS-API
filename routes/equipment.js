const express = require("express");
const router = express.Router();
const equipmentController = require("../controllers/equipmentController");
const { METHOD, PATH } = require("../constants/index");

const equipmentRoutes = [
  {
    method: METHOD.GET,
    path: PATH.EQUIPMENT,
    handler: equipmentController.getAllEquipments,
  },
  {
    method: METHOD.GET,
    path: PATH.EQUIPMENT_ID,
    handler: equipmentController.getOneEquipment,
  },
  {
    method: METHOD.POST,
    path: PATH.EQUIPMENT,
    handler: equipmentController.createEquipment,
  },
  {
    method: METHOD.PATCH,
    path: PATH.EQUIPMENT_EDIT_ID,
    handler: equipmentController.updateEquipment,
  },
  {
    method: METHOD.DELETE,
    path: PATH.EQUIPMENT_ID,
    handler: equipmentController.deleteEquipment,
  },
];

equipmentRoutes.forEach((route) => {
  const { method, path, handler } = route;
  router[method](path, handler);
});

module.exports = router;
