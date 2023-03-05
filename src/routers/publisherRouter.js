const router = require("express").Router();
const publisherController = require("../app/controllers/publisherController");

//2
router.get("/:slug", publisherController.detail);

//3
router.post("/create", publisherController.create);

//4
router.put("/update/:id", publisherController.update);

//5
router.delete("/delete/:id", publisherController.delete);
//1
router.get("/", publisherController.getAllPublisher);

module.exports = router;
