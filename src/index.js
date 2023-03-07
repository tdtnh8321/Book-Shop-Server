require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const db = require("./config/db/index");
const router = require("./routers/index");
const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(
  cors({
    origin: [
      `${process.env.CLIENT_CUSTOMER_URL}`,
      `${process.env.CLIENT_ADMIN_URL}`,
    ],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    credentials: true,
    exposedHeaders: ["*", "Authorization"],
  })
);

app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(morgan("combined"));
db.connect();
router(app);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
  console.log("Customer ", process.env.CLIENT_CUSTOMER_URL);
  console.log("ADmin ", process.env.CLIENT_ADMIN_URL);
});
