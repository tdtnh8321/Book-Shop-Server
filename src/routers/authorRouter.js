const router = require("express").Router();
const authorController = require("../app/controllers/authorController");

//2
router.get("/:slug", authorController.detail);

//3
router.post("/create", authorController.create);

//4
router.put("/update", authorController.update);

//5
router.delete("/delete/:id", authorController.delete);
//1
router.get("/", authorController.getAllAuthor);

module.exports = router;
