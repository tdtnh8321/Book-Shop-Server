const voucherModel = require("../models/voucherModel");
const VoucherController = {
  getAllVoucher: async (req, res) => {
    try {
      await voucherModel.find().then((data) => {
        return res.status(200).json(data);
      });
    } catch (error) {
      return res.status(500).json({ msg: "getAllVoucher " + error });
    }
  },
  detail: async (req, res) => {
    try {
      await voucherModel.findOne({ slug: req.params.slug }).then((data) => {
        return res.status(200).json(data);
      });
    } catch (error) {
      return res.status(500).json({ msg: "detailVoucher " + error });
    }
  },
  create: async (req, res) => {
    try {
      const nameCheck = req.body.name.toLowerCase().split(" ").join("-");
      const checkAmount = await voucherModel.count({ slug: nameCheck });
      if (checkAmount == 0) {
        const voucher = new voucherModel(req.body);
        await voucher.save().then(() => {
          return res.status(200).json({ msg: "Create new vocher success!!!" });
        });
      } else {
        return res.status(403).json({ msg: "Ten da ton tai" });
      }
    } catch (error) {
      return res.status(500).json({ msg: "createVoucher " + error });
    }
  },
  update: async (req, res) => {
    try {
      await voucherModel.findByIdAndUpdate(req.body._id, req.body).then(() => {
        return res.status(200).json({ msg: "update sccess" });
      });
    } catch (error) {
      return res.status(500).json({ msg: "updateVoucher " + error });
    }
  },
  delete: async (req, res) => {
    try {
      await voucherModel.deleteOne({ _id: req.params.id }).then(() => {
        return res.status(200).json({ msg: "delete success" });
      });
    } catch (error) {
      return res.status(500).json({ msg: "deleteVoucher " + error });
    }
  },
};
module.exports = VoucherController;
