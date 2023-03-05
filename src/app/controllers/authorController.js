const AuthorModel = require("../models/authorModel");
const AuthorController = {
  //1. Lấy danh sách
  getAllAuthor: async (req, res) => {
    try {
      await AuthorModel.find().then((data) => {
        return res.status(200).json(data);
      });
    } catch (error) {
      return res.status(500).json({ msg: "getAllAuthor " + error });
    }
  },
  //2. Lấy thông tin chi tiết
  detail: async (req, res) => {
    try {
      await AuthorModel.findOne({ slug: req.params.slug }).then((data) => {
        return res.status(200).json(data);
      });
    } catch (error) {
      return res.status(500).json({ msg: "detailAuthor " + error });
    }
  },
  //3. Thêm
  create: async (req, res) => {
    try {
      const nameCheck = req.body.name.toLowerCase().split(" ").join("-");
      const checkAmount = await AuthorModel.count({ slug: nameCheck });
      if (checkAmount == 0) {
        const author = new AuthorModel(req.body);
        await author.save().then(() => {
          return res.status(200).json({ msg: "Create new author success!!!" });
        });
      } else {
        return res.status(403).json({ msg: "Ten da ton tai" });
      }
    } catch (error) {
      return res.status(500).json({ msg: "createAuthor " + error });
    }
  },
  //4. Sửa
  update: async (req, res) => {
    try {
      await AuthorModel.findByIdAndUpdate(req.body._id, req.body).then(() => {
        return res.status(200).json({ msg: "update Author success" });
      });
    } catch (error) {
      return res.status(500).json({ msg: "updateAuthor " + error });
    }
  },
  //5. Xóa
  delete: async (req, res) => {
    try {
      await AuthorModel.deleteOne({ _id: req.params.id }).then(() => {
        return res.status(200).json({ msg: "delete Author success" });
      });
    } catch (error) {
      return res.status(500).json({ msg: "deleteAuthor " + error });
    }
  },
};
module.exports = AuthorController;
