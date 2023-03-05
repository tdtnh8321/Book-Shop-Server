const router = require("express").Router();
const orderController = require("../app/controllers/orderController");
//1
router.get("/", orderController.getAllOrder);
//2
router.get("/get_order_by_status", orderController.getAllOrderByStatus);
//3
router.get("/get_order_of_user", orderController.getAllOrderOfUser);
//4
router.post("/create", orderController.createOrder);
//5
router.put("/admin_update_status", orderController.adminUpdateStatus);
//6
router.put("/user_update_status/:id", orderController.userUpdateStatus);

router.put("/update", orderController.updateStatus);

//7
router.get("/detail/:id", orderController.getAllOrderDetailOfOrderId);
//8
router.get("/:id", orderController.getOrderInfo);
module.exports = router;
