const mongoose  = require('mongoose');

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
    createdAt: {
      type: Number
    },
    type: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    versionKey: false,
    timestamps: {
      currentTime: () => Date.now()
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);;

// 虛擬
postSchema.virtual('comments', {
  ref: 'comment',        // commentModel
  foreignField: 'post',  // 參照post
  localField: '_id'      // post的Id
})

const PostModel = new mongoose.model('posts', postSchema);


module.exports = {
  PostModel,
};