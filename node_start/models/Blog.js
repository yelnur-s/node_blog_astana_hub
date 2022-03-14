const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: String,
  description: String,
  date: {
      type: Date,
      default: Date.now
  }
});

module.exports = mongoose.model("Blog", BlogSchema);

