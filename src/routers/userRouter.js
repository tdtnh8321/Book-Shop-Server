const router = require("express").Router();

const auth = require("../app/middleware/auth");

const userController = require("../app/controllers/userController");
//1.Đăng ký cho khách hàng
router.post("/register_customer", userController.registerCustomer);
//2. Đăng ký cho admin

//3. Đăng ký cho shipper

//4 activate
router.post("/activate", userController.activateEmail);

//5.Đăng nhập khách hàng
router.post("/login_customer", userController.loginCustomer);

//6 login admin
router.post("/login_admin", userController.loginAdmin);

//7 login shipper

//8. tạo AccessToken
router.get("/refresh_token", userController.getAccessToken);
//9 forgot password

//10 reset password

//11 logout
router.get("/logout", userController.logout);
//12.Xem thông tin chi tiết
router.get("/profile", auth, userController.profile);

//13 list account
router.get("/list_user/:role", userController.getAllUser);

//14 update info
router.put("/update", userController.updateProfile);

//15 update role
router.put("/update_role", userController.updateRole);

//16. forgot
router.post("/forgot", userController.forgotPassword);
//17.reset
router.post("/reset", auth, userController.resetPassword);
module.exports = router;
