const router = require("express").Router();
const supplierController = require("../app/controllers/supplierController");

//2
router.post("/create", supplierController.create);

//1
router.get("/", supplierController.getAllSupplier);
module.exports = router;
