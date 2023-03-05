const uploadRouter = require("./uploadRouter");
const bookRouter = require("./bookRouter");
const typeRouter = require("./typeRouter");
const authorRouter = require("./authorRouter");
const publisherRouter = require("./publisherRouter");
const voucherRouter = require("./voucherRouter");
const userRouter = require("./userRouter");

const orderRouter = require("./orderRouter");
const importRouter = require("./importRouter");
const supplierRouter = require("./supplierRouter");

function route(app) {
  app.use("/api", uploadRouter);
  app.use("/book", bookRouter);
  app.use("/type", typeRouter);
  app.use("/author", authorRouter);
  app.use("/publisher", publisherRouter);
  app.use("/voucher", voucherRouter);
  app.use("/user", userRouter);
  app.use("/order", orderRouter);
  app.use("/import", importRouter);
  app.use("/supplier", supplierRouter);
}
module.exports = route;
