const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {
    type: String,
  },
  gender: {
    type: Number, //0:Another,1:Male,2:Female
  },
  email: {
    type: String,
  },
  phone: {
    type: Number,
  },
  address: {
    type: String,
  },
  date: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: Number, //0:admin,1:user
  },
});
module.exports = mongoose.model("Users", UserSchema);
