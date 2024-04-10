const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { METHOD, PATH } = require("../constants/index");

const reportRoutes = [
  {
    method: METHOD.GET,
    path: PATH.REPORTS,
    handler: reportController.getAllReports,
  },
  {
    method: METHOD.GET,
    path: PATH.REPORT_ID,
    handler: reportController.getOneReport,
  },
  {
    method: METHOD.POST,
    path: PATH.REPORTS,
    handler: reportController.createReport,
  },
  {
    method: METHOD.PATCH,
    path: PATH.REPORT_EDIT_ID,
    handler: reportController.updateReport,
  },
  {
    method: METHOD.DELETE,
    path: PATH.REPORT_ID,
    handler: reportController.deleteReportData,
  },
];

reportRoutes.forEach((route) => {
  const { method, path, handler } = route;
  router[method](path, handler);
});

module.exports = router;
