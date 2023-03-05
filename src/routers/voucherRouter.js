const router = require("express").Router();
const voucherController = require("../app/controllers/voucherController");

//2
router.get("/:slug", voucherController.detail);

//3
router.post("/create", voucherController.create);

//4
router.put("/update", voucherController.update);

//5
router.delete("/delete/:id", voucherController.delete);

//1
router.get("/", voucherController.getAllVoucher);
module.exports = router;
