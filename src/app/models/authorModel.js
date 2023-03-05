const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var slug = require("mongoose-slug-updater");
const AuthorSchema = new Schema({
  name: {
    type: String,
  },
  slug: {
    type: String,
    slug: "name",
  },
});
mongoose.plugin(slug);
module.exports = mongoose.model("Authors", AuthorSchema);
