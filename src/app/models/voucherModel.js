const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var slug = require("mongoose-slug-updater");
const VoucherSchema = new Schema({
  name: {
    type: String,
  },
  slug: {
    type: String,
    slug: "name",
  },
  reduce: {
    //giá giảm
    type: Number,
  },
  qty: {
    type: Number,
  },
});
mongoose.plugin(slug);
module.exports = mongoose.model("Vouchers", VoucherSchema);
