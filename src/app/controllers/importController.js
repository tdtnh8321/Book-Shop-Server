const importModel = require("../models/importModel");
const importDetailModel = require("../models/importDetailModel");
const bookModel = require("../models/bookModel");

const ImportController = {
  //1. Lấy tất cả các phiếu nhập theo status
  getAllImport: async (req, res) => {
    try {
      await importModel
        .find({ status: req.params.status })
        .populate("idAdmin")
        .populate("idSupplier")
        .then((data) => {
          return res.status(200).json(data);
        });
    } catch (error) {
      return res.status(500).json({ msg: "getAllImport " + error });
    }
  },
  //2.Lấy chi tiết phiếu nhập
  getImportDetail: async (req, res) => {
    try {
      await importDetailModel
        .find({ idImport: req.params.id })
        .populate("idBook")
        .then((data) => {
          return res.status(200).json(data);
        });
    } catch (error) {
      return res.status(500).json({ msg: "getImportDetail " + error });
    }
  },
  //3. Thêm phiếu nhập+chi tiết phiếu nhập
  createImport: async (req, res) => {
    try {
      const { importInfo, items } = req.body;
      const { idAdmin, idSupplier, total } = importInfo;
      console.log({ importInfo, items });
      const d = new Date();

      const newImport = new importModel();
      newImport.total = total;
      newImport.idSupplier = idSupplier;
      newImport.date = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
      newImport.idAdmin = idAdmin;
      newImport.status = 0;

      newImport.save((err, rs) => {
        if (err) {
          return res.status(403).json({ msg: "Tạo phiếu nhập lỗi" });
        } else {
          const idImport = rs._id;

          items.forEach((item) => {
            const newItem = new importDetailModel();
            newItem.idImport = idImport;
            newItem.idBook = item.idBook;
            newItem.amount = item.amount;
            newItem.price = item.price;
            newItem.total = item.total;
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
      return res.status(200).json({ msg: "Nhập hàng hoàn tất" });
    } catch (error) {
      return res.status(500).json({ msg: "createImport " + error });
    }
  },
  //4.duyệt phiếu nhập
  submitImport: async (req, res) => {
    try {
      const { idImport } = req.body;
      console.log(idImport);

      const listImportDetail = await importDetailModel
        .find({ idImport: idImport })
        .then((data) => data);
      listImportDetail.forEach((importDetail) => {
        bookModel.findById(importDetail.idBook, (error, book) => {
          if (error) {
            console.log("Loi cap nhat so luong ");
            return res.status(200).json({ msg: "Loi cap nhat so luong " });
          } else {
            book.qty += importDetail.amount;
            book.save();
          }
        });
      });
      const importUpdate = await importModel.findById(idImport);
      importUpdate.status = 1;
      importUpdate.save();
      console.log("Duyệt phiếu nhập thành công");
      return res.status(200).json({ msg: "Duyệt phiếu nhập thành công" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "submitImport ", error });
    }
  },
};
module.exports = ImportController;
