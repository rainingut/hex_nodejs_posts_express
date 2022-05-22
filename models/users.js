const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '暱稱必填'],
    },
    email: {
      type: String,
      required: [true, 'Email必填'],
      immutable: true, // 不可變 https://stackoverflow.com/questions/50544198
      select: false,
    },
    password: {
      type: String,
      required: [true, '密碼必填'],
      select: false,
    },
    sex: {
      type: String,
      enum: ['male', 'female'],
    },
    avatar: {
      type: String,
      default: '',
    },
    comments: {
      type: [{
        id: mongoose.Schema.ObjectId,  // posts
      }],
    },
    likes: {
      type: [mongoose.Schema.ObjectId], // posts
      default: [],
    },
    following: {
      type: [mongoose.Schema.ObjectId], // users
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    permission: {
      type: String, 
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    versionKey: false,
  }
);

const UserModel = new mongoose.model('users', userSchema);

module.exports = {
  UserModel,
};