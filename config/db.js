const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const connection = mongoose.connect(
  "mongodb+srv://sanketpatil:1234@cluster0.t6cal0u.mongodb.net/test"
);

module.exports = { connection };