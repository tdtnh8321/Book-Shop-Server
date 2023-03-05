const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema = new Schema({
  total: {
    //tổng tiền của hóa đơn sau khi đã dùng mã giảm giá
    type: Number,
  },
  date: {
    type: String,
  },
  note: {
    type: String,
  },
  idVoucher: {
    type: Schema.Types.ObjectId,
    ref: "Vouchers",
  },
  idUser: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  status: {
    //0: đã hủy
    //1: đang xử lý -> nhấn duyệt
    //2: đã xử lý -> nhấn giao hàng
    //3: đang giao -> khách hàng nhấn nút xác nhận
    //4: hoàn thành
    type: Number,
  },
  idAdmin: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  dateAccept: {
    //ngày duyệt đơn
    type: String,
  },
  dateTransport: {
    //ngày vận chuyển
    type: String,
  },
  dateReceive: {
    //ngày nhận
    type: String,
  },
  dateDelete: {
    //ngay huy
    type: String,
  },
});
module.exports = mongoose.model("Orders", orderSchema);
