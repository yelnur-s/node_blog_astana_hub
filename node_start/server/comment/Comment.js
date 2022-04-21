const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: String,
  user: {type: Schema.Types.ObjectId, ref: "User"},
  blog: {type: Schema.Types.ObjectId, ref: "Blog"},
  date: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Comment", CommentSchema);

