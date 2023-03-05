const router = require("express").Router();
const importController = require("../app/controllers/importController");

//1
router.get("/getall/:status", importController.getAllImport);

//2
router.get("/detail/:id", importController.getImportDetail);

//3
router.post("/create", importController.createImport);

//4
router.put("/update", importController.submitImport);

module.exports = router;
