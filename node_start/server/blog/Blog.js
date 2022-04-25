const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: String,
  description: String,
  date: {
      type: Date,
      default: Date.now
  },
  img: String,
  author: {type: Schema.Types.ObjectId, ref: "User"},
  category: {type: Schema.Types.ObjectId, ref: "Category"},
  tags: [{type: Schema.Types.ObjectId, ref: "Tag"}]
});

module.exports = mongoose.model("Blog", BlogSchema);

