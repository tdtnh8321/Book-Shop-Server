const voucherModel = require("../models/voucherModel");
const orderModel = require("../models/orderModel");
const orderDetailModel = require("../models/orderDetailModel");
const bookModel = require("../models/bookModel");

const OrderController = {
  //1. Lay tat ca cac hoa don
  getAllOrder: async (req, res) => {
    try {
      await orderModel
        .find()
        .populate({ path: "idUser" })
        .populate({ path: "idVoucher" })
        .then((data) => {
          return res.status(200).json(data);
        });
    } catch (error) {
      return res.status(500).json({ msg: "getAllOrder: " + error });
    }
  },
  //2. Lay danh sach hoa don theo trang thai(hien tren trang admin)
  getAllOrderByStatus: async (req, res) => {
    try {
      await orderModel
        .find({ status: req.query.status })
        .populate({ path: "idUser" })
        .populate({ path: "idVoucher" })
        .then((data) => {
          return res.status(200).json(data);
        });
    } catch (error) {
      return res.status(500).json({ msg: "getAllOrderByStatus: " + err });
    }
  },
  //3. Lay danh sach hoa don cua 1 user(hien tren trang khach hang)
  getAllOrderOfUser: async (req, res) => {
    try {
      console.log(req.query.iduser, req.query.status);
      await orderModel
        .find({ idUser: req.query.iduser, status: req.query.status })
        .populate({ path: "idUser" })
        .populate({ path: "idVoucher" })
        .then((data) => {
          return res.status(200).json(data);
        });
    } catch (error) {
      return res.status(500).json({ msg: "getAllOrderOfUser: " + err });
    }
  },
  //4. Khách hàng tạo đơn hàng
  createOrder: async (req, res) => {
    try {
      const { idUser, total, idVoucher, items, note } = req.body;
      console.log({ idUser, total, idVoucher, items, note });
      const d = new Date();
      const newOrder = new orderModel();
      newOrder.idUser = idUser;
      newOrder.idVoucher = idVoucher;
      newOrder.total = total;
      newOrder.date = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
      newOrder.note = note;
      newOrder.status = 1;
      //lưu order vào database
      newOrder.save(function (err, rs) {
        if (err) {
          return res.status(403).json({ msg: "Tạo đơn hàng lỗi" });
        } else {
          //trừ số lượng của voucher
          voucherModel.findById(idVoucher).then((data) => {
            data.qty -= 1;
            data.save();
          });
          //trả lại idOrder
          const idOrder = rs._id;
          //lưu danh sách orderDetail
          items.forEach((item) => {
            const newItem = new orderDetailModel();
            newItem.idOrder = idOrder;
            newItem.idBook = item.idBook;
            newItem.amount = item.amount;
            newItem.price = item.price;
            newItem.total = item.total;

            //trừ số lượng trong kho
            bookModel.findById(item.idBook).then((data) => {
              data.qty -= item.amount;
              data.save();
            });

            //check lưu orderDetail
            newItem.save((err, rs) => {
              if (err) {
                return res
                  .status(403)
                  .json({ msg: "Thêm chi tiết đơn hàng lỗi!" });
              }
            });
          });
        }
      });
      return res.status(200).json({ msg: "Đặt hàng hoàn tất" });
    } catch (error) {
      return res.status(500).json({ msg: "createOrder: " + error });
    }
  },
  //5. admin cập nhật status
  //-xử lý đơn 1->2
  //-giao hàng 2->3
  adminUpdateStatus: async (req, res) => {
    try {
      const idOrder = req.body.idOrder;
      const status = req.body.status;
      const idAdmin = req.body.idAdmin;
      console.log("check: ", idOrder, status, idAdmin);
      const d = new Date();

      if (status == 2) {
        const dateAccept =
          d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
        await orderModel
          .updateOne(
            { _id: idOrder },
            { status: status, idAdmin: idAdmin, dateAccept: dateAccept }
          )
          .then(() => {
            return res
              .status(200)
              .json({ msg: "Xác nhận đơn hàng thành công" });
          });
      } else if (status == 3) {
        const dateTransport =
          d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
        await orderModel
          .updateOne(
            { _id: idOrder },
            { status: status, idAdmin: idAdmin, dateTransport: dateTransport }
          )
          .then(() => {
            return res.status(200).json({
              msg: "Xử lý đơn hàng thành công, đơn hàng sẽ được chuyển đến bộ phận giao hàng",
            });
          });
      }
    } catch (error) {
      return res.status(500).json({ msg: "adminUpdateStatus: " + error });
    }
  },
  //6.Khách hàng tương tác với đơn hàng
  //-Khách hàng xác nhận đơn hàng 3->4
  //-Khách hàng hủy đơn hàng ->0
  userUpdateStatus: async (req, res) => {
    try {
      const idOrder = req.params.id;
      const status = req.query.status;
      const d = new Date();
      if (status == 4) {
        const dateReceive =
          d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
        await orderModel
          .updateOne(
            { _id: idOrder },
            { status: status, dateReceive: dateReceive }
          )
          .then(() => {
            return res.status(200).json({ msg: "Nhận đơn hàng thành công" });
          });
      }
      //Khi hủy đơn hàng, trả lại số lượng cho kho
      else if (status == 0) {
        const preStatus = await orderModel
          .findById(idOrder)
          .then((data) => data.status);
        if (preStatus == 1) {
          const dateDelete =
            d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
          await orderModel
            .updateOne(
              { _id: idOrder },
              { status: status, dateDelete: dateDelete }
            )
            .then(() => {
              orderDetailModel.find({ idOrder: idOrder }).then((orderItems) => {
                orderItems.forEach((item) => {
                  bookModel.findById(item.idBook).then((b) => {
                    b.qty += item.amount;
                    b.save();
                  });
                });
              });
            });
          return res.status(200).json({ msg: "Hủy đơn hàng thành công" });
        } else if (preStatus != 1) {
          return res.status(400).json({ msg: "Không thể hủy đơn hàng" });
        }
      }
    } catch (error) {
      return res.status(500).json({ msg: "userUpdateStatus: " + err });
    }
  },
  updateStatus: async (req, res) => {
    try {
      const { idOrder, status } = req.body;
      console.log("updateStatus: ", { idOrder, status });
      if (status == 2) {
        await orderModel
          .updateOne({ _id: idOrder }, { status: status })
          .then(() => {
            return res
              .status(200)
              .json({ msg: "Xác nhận đơn hàng thành công" });
          });
      } else if (status == 3) {
        await orderModel
          .updateOne({ _id: idOrder }, { status: status })
          .then(() => {
            return res.status(200).json({
              msg: "Xử lý đơn hàng thành công, đơn hàng sẽ được chuyển đến bộ phận giao hàng",
            });
          });
      } else if (status == 4) {
        await orderModel
          .updateOne({ _id: idOrder }, { status: status })
          .then(() => {
            return res.status(200).json({ msg: "Nhận đơn hàng thành công" });
          });
      } else if (status == 0) {
        const preStatus = await orderModel
          .findById(idOrder)
          .then((data) => data.status);
        if (preStatus == 1) {
          await orderModel
            .updateOne({ _id: idOrder }, { status: status })
            .then(() => {
              orderDetailModel.find({ idOrder: idOrder }).then((orderItems) => {
                orderItems.forEach((item) => {
                  bookModel.findById(item.idBook).then((b) => {
                    b.qty += item.amount;
                    b.save();
                  });
                });
              });
            });
          return res.status(200).json({ msg: "Hủy đơn hàng thành công" });
        } else if (preStatus != 1) {
          return res.status(400).json({ msg: "Không thể hủy đơn hàng" });
        }
      }
    } catch (error) {
      return res.status(500).json({ msg: "updateStatus: " + error });
    }
  },
  //7.Lay danh sach order detail cua 1 order
  getAllOrderDetailOfOrderId: async (req, res) => {
    try {
      await orderDetailModel
        .find({ idOrder: req.params.id })
        .populate("idBook")
        .then((data) => {
          return res.status(200).json(data);
        });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "getAllOrderDetailOfOrderId: " + err });
    }
  },
  //8. Lấy thông tin 1 order
  getOrderInfo: async (req, res) => {
    try {
      await orderModel
        .findById(req.params.id)
        .populate("idVoucher idUser")
        .populate("idAdmin")
        .then((data) => res.status(200).json(data));
    } catch (error) {
      return res.status(500).json({ msg: "getOrderInfo: " + error });
    }
  },
  //9. Lấy danh sách order của shipper + statusOrder
  getOrderByShipperIdAndStatusOrder: async (req, res) => {
    try {
      const idShipper = req.query.idshipper;
      const statusOrder = req.query.statusorder;
      console.log({ idShipper, statusOrder });
      await orderModel
        .find({ status: statusOrder })
        .then((data) => res.status(200).json(data));
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "getOrderByShipperIdAndStatusOrder: " + error });
    }
  },
};
module.exports = OrderController;
