const mongoose = require("mongoose");
async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://tdtnh8321:Tdtnh491@book-shop.t8cn4pv.mongodb.net/Book_Shop",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connect successfully");
  } catch (error) {
    console.log("Connect Failure");
  }
}
module.exports = { connect };
