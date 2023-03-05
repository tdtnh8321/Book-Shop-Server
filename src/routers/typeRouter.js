const router = require("express").Router();
const typeController = require("../app/controllers/typeController");

//2
router.get("/:slug", typeController.detail);
//3
router.post("/create", typeController.create);
//4
router.put("/update", typeController.update);
//
router.delete("/delete/:id", typeController.delete);
//1
router.get("/", typeController.getAllType);

module.exports = router;
