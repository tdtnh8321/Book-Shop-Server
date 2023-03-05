const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ImportDetailSchema = new Schema({
  idImport: {
    type: Schema.Types.ObjectId,
    ref: "Imports",
  },
  idBook: {
    type: Schema.Types.ObjectId,
    ref: "Books",
  },
  amount: {
    type: Number,
  },
  price: {
    type: Number,
  },
  total: {
    type: Number,
  },
});
module.exports = mongoose.model("ImportDetails", ImportDetailSchema);
