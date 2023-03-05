const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var slug = require("mongoose-slug-updater");
const SupplierSchema = new Schema({
  name: {
    type: String,
  },
  slug: {
    type: String,
    slug: "name",
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
});
mongoose.plugin(slug);
module.exports = mongoose.model("Suppliers", SupplierSchema);
