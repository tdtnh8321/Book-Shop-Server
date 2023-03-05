const supplierModel = require("../models/supplierModel");
const SupplierController = {
  getAllSupplier: async (req, res) => {
    try {
      await supplierModel.find().then((data) => res.status(200).json(data));
    } catch (error) {
      return res.status(500).json({ msg: "getAllSupplier", error });
    }
  },
  create: async (req, res) => {
    try {
      const newSupplier = new supplierModel(req.body);
      await newSupplier
        .save()
        .then(() => res.status(200).json({ msg: "createSupplier success!!!" }));
    } catch (error) {
      return res.status(500).json({ msg: "create", error });
    }
  },
};
module.exports = SupplierController;
