const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ImportSchema = new Schema({
  date: {
    type: String,
  },
  total: {
    type: Number,
  },
  idAdmin: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  idSupplier: {
    type: Schema.Types.ObjectId,
    ref: "Suppliers",
  },
  status: { type: Number },
});
module.exports = mongoose.model("Imports", ImportSchema);
