const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("./sendMail");

const { CLIENT_CUSTOMER_URL, CLIENT_ADMIN_URL, REFRESH_TOKEN_SECRET } =
  process.env;

const UserController = {
  //1.Đăng ký cho khách hàng
  registerCustomer: async (req, res) => {
    try {
      const { name, gender, email, phone, address, date, password } = req.body;
      console.log({ name, gender, email, phone, address, date, password });
      if (!validateEmail(email))
        return res.status(400).json({ msg: "Invalid Email!" });

      const userCheck1 = await UserModel.findOne({ email: email });

      if (userCheck1 != null)
        return res.status(400).json({ msg: "This email is already exists." });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = {
        name,
        gender,
        email,
        phone,
        address,
        date,
        password: passwordHash,
        role: 1,
      };

      const activation_token = createActivationToken(newUser);
      const url = `${CLIENT_CUSTOMER_URL}/user/activate/${activation_token}`;
      sendMail(email, url, "Verify your email address");

      return res
        .status(200)
        .json({ msg: "Register Success! Please activate your email to start" });
    } catch (error) {
      return res.status(500).json({ msg: "register " + error });
    }
  },
  //2. Đăng ký cho admin

  //3. Đăng ký cho shipper

  //4. activate
  activateEmail: async (req, res) => {
    try {
      const { activation_token } = req.body;
      console.log(activation_token);
      const user = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );
      const { name, gender, email, phone, address, date, password, role } =
        user;
      console.log("user: ", user);
      const newUser = new UserModel({
        name,
        gender,
        email,
        phone,
        address,
        date,
        password,
        role,
      });
      await newUser.save();
      return res.status(200).json({ msg: "Account has been activated!" });
    } catch (error) {
      return res.status(500).json({ msg: "Activate: " + error });
    }
  },

  //5.Đăng nhập khách hàng
  loginCustomer: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log({ email, password });
      const user = await UserModel.findOne({ email });
      console.log("login:id: " + user._id);
      if (!user)
        return res
          .status(200)
          .json({ msg: "This email does not exist.", rs: 0 });

      const isMatch = await bcrypt.compare(password, user.password);
      console.log({ isMatch });
      if (!isMatch) {
        console.log("Password is incorrect.");
        return res.status(200).json({ msg: "Password is incorrect.", rs: 0 });
      }

      const refresh_token = createRefreshToken({ id: user._id });
      // console.log("refresh_token: ", refresh_token);
      // res.cookie("refreshtoken", refresh_token, {
      //   httpOnly: true,
      //   secure: false,
      //   path: "/user/refresh_token",
      //   sameSite: "strict",
      //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // });

      if (user.role == 1) {
        console.log("true");
        return res.status(200).json({
          msg: "Login customer success!",
          rs: 1,
          refresh_token: refresh_token, //
        });
      } else {
        console.log("false");
        return res.status(200).json({ msg: "Not customer", rs: 0 });
      }
    } catch (err) {
      return res.status(500).json({ msg: "Login: " + err.message });
    }
  },
  //6. Đăng nhập admin
  loginAdmin: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log({ email, password });
      const user = await UserModel.findOne({ email });
      console.log("login:id: " + user._id);
      if (!user)
        return res
          .status(200)
          .json({ msg: "This email does not exist.", rs: 0 });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(200).json({ msg: "Password is incorrect.", rs: 0 });

      const refresh_token = createRefreshToken({ id: user._id });
      console.log("refresh_token: ", refresh_token);
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        secure: false,
        path: "/user/refresh_token",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      if (user.role == 0) {
        console.log("admin");
        return res.status(200).json({ msg: "Login admin success!", rs: 1 });
      } else {
        console.log("not admin");
        return res.status(200).json({ msg: "You are not admin!!!", rs: 0 });
      }
    } catch (err) {
      return res.status(500).json({ msg: "Login: " + err.message });
    }
  },

  //7. Đăng nhập shipper

  //8. tạo AccessToken
  getAccessToken: async (req, res) => {
    try {
      //const rf_token = req.cookies.refreshtoken;
      rf_token = req.query.refreshtoken;
      console.log({ rf_token });
      if (!rf_token) return res.status(400).json({ msg: "Please login now!" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({ msg: "Please login now!" });

        const access_token = createAccessToken({ id: user.id });
        return res.status(200).json({ access_token });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  //11. Đăng xuất
  logout: async (req, res) => {
    try {
      console.log("checklogout1: ", req.cookies.refreshtoken);
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      console.log("checklogout2: ", req.cookies.refreshtoken);
      return res.status(200).json({ msg: "Logged out success!!!" });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
  //12.Xem thông tin chi tiết
  profile: async (req, res) => {
    try {
      console.log(req.user.id);
      const user = await UserModel.findById(req.user.id)
        .select("-password")
        .then((data) => data);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ msg: "profile " + error });
    }
  },
  //13. Danh sách account
  getAllUser: async (req, res) => {
    try {
      const role = req.params.role;
      const users = await UserModel.find({ role })
        .select("-password")
        .then((data) => data);
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ msg: "getAllUser " + error });
    }
  },
  //14. Cập nhật thông tin
  updateProfile: async (req, res) => {
    try {
      console.log(req.body);
      await UserModel.findByIdAndUpdate(req.body._id, req.body).then(() => {
        return res.status(200).json({ msg: "Update profile success!!" });
      });
    } catch (error) {
      return res.status(500).json({ msg: "updateProfile " + error });
    }
  },

  //15. Cập nhật role
  updateRole: async (req, res) => {
    try {
      const id = req.body.id;
      const role = req.body.role;
      console.log(id + "-" + role);
      await UserModel.findById(id).then((data) => {
        data.role = role;
        data.save();
        return res.status(200).json({ msg: "Update role success" });
      });
    } catch (error) {
      return res.status(500).json({ msg: "updateRole " + error });
    }
  },
  //16. Quên mk
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      console.log(email);
      const user = await UserModel.findOne({ email });
      if (!user)
        return res.status(400).json({ msg: "This email does not exist." });

      const access_token = createAccessToken({ id: user._id });
      const url = `${CLIENT_CUSTOMER_URL}/user/reset/${access_token}`;

      sendMail(email, url, "Reset your password");
      return res
        .status(200)
        .json({ msg: "Re-send the password, please check your email." });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  },
  //17. reset password
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;
      console.log(password);
      const passwordHash = await bcrypt.hash(password, 12);

      await UserModel.findOneAndUpdate(
        { _id: req.user.id },
        {
          password: passwordHash,
        }
      ).then(() =>
        res.status(200).json({ msg: "Password successfully changed!" })
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "5m",
  });
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = UserController;
