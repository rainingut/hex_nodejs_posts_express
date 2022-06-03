const mongoose  = require('mongoose');
const UserModel = require('./users');

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name 必填'] 
    },
    image: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      required: [true, '內容必填']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
      required: [true, '使用者必填'],
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
      },
    ],
    comment: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Number
    },
    type: {
      type: [String],
      default: []
    },
    tags: {
      type: [String],
      default: []
    },
  },
  {
    versionKey: false,
    timestamps: {
      currentTime: () => Date.now()
    }
  }
);;

const PostModel = new mongoose.model('posts', postSchema);

module.exports = {
  PostModel,
};