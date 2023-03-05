const TypeModel = require("../models/typeModel");
const TypeController = {
  //1. Lấy danh sách
  getAllType: async (req, res) => {
    try {
      await TypeModel.find().then((data) => {
        return res.status(200).json(data);
      });
    } catch (error) {
      return res.status(500).json({ msg: "getAllType " + error });
    }
  },
  //2. Lấy thông tin chi tiết
  detail: async (req, res) => {
    try {
      await TypeModel.findOne({ slug: req.params.slug }).then((data) => {
        return res.status(200).json(data);
      });
    } catch (error) {
      return res.status(500).json({ msg: "detailType " + error });
    }
  },
  //3. Thêm
  create: async (req, res) => {
    try {
      const nameCheck = req.body.name.toLowerCase().split(" ").join("-");
      const checkAmount = await TypeModel.count({ slug: nameCheck });
      if (checkAmount == 0) {
        const type = new TypeModel(req.body);
        await type.save().then(() => {
          return res.status(200).json({ msg: "Create new type success!!!" });
        });
      } else {
        return res.status(403).json({ msg: "Ten da ton tai" });
      }
    } catch (error) {
      return res.status(500).json({ msg: "createType " + error });
    }
  },
  //4. Sửa
  update: async (req, res) => {
    try {
      await TypeModel.findByIdAndUpdate(req.body._id, req.body).then(() => {
        return res.status(200).json({ msg: "update Type success" });
      });
    } catch (error) {
      return res.status(500).json({ msg: "updateType " + error });
    }
  },
  //5. Xóa
  delete: async (req, res) => {
    try {
      await TypeModel.deleteOne({ _id: req.params.id }).then(() => {
        return res.status(200).json({ msg: "delete Type success" });
      });
    } catch (error) {
      return res.status(500).json({ msg: "deleteType " + error });
    }
  },
};
module.exports = TypeController;
