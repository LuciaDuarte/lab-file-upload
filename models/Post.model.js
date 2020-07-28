// models/Post.model.js

//const { Schema, model, Mongoose } = require('mongoose');
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    picPath: String,
    picName: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Post', postSchema);
