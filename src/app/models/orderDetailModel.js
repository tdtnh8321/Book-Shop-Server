const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OrderDetailSchema = new Schema({
  idOrder: {
    type: Schema.Types.ObjectId,
    ref: "Orders",
  },
  idBook: {
    type: Schema.Types.ObjectId,
    ref: "Books",
  },
  amount: {
    //số lượng
    type: Number,
  },
  price: {
    //giá bấn
    type: Number,
  },
  total: {
    //tổng tiền
    type: Number,
  },
});
module.exports = mongoose.model("OrderDetails", OrderDetailSchema);
