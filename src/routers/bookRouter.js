const router = require("express").Router();
const bookController = require("../app/controllers/bookController");
//9
router.get("/getlistallbook", bookController.getListAllBook);
//10
router.get("/countpages", bookController.getCountPages);
//9
router.get("/selling", bookController.getListSelling);
//2.
router.get("/search", bookController.findByName);
//3
router.get("/:slug", bookController.detail);
//4
router.post("/create", bookController.create);
//5
router.put("/update", bookController.update);
//6
router.delete("/delete/:id", bookController.delete);
//7
router.post("/add_amout", bookController.addAmount);
//8
router.get("/check_amount/:id", bookController.checkAmount);
//1.
router.get("/", bookController.getAllBook);

module.exports = router;
