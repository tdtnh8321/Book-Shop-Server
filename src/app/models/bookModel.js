const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var slug = require("mongoose-slug-updater");
const BookSchema = new Schema(
  {
    name: {
      type: String,
    },
    slug: {
      type: String,
      slug: "name",
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
    },
    qty: {
      type: Number,
    },
    description: {
      type: String,
    },
    idAuthor: {
      type: Schema.Types.ObjectId,
      ref: "Authors",
    },
    idType: {
      type: Schema.Types.ObjectId,
      ref: "Types",
    },
    idPublisher: {
      type: Schema.Types.ObjectId,
      ref: "Publishers",
    },
    status: {
      type: Number,
      //0:block
      //1:qty>0,
      //2:qty=0,
    },
  },
  {
    timestamps: true,
  }
);
mongoose.plugin(slug);
module.exports = mongoose.model("Books", BookSchema);
