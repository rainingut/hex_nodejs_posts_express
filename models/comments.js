const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, '內容必填'],
      trim: true
    },
    createdAt: {
      type: Number,
    },
    updatedAt: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
      required: [true, '填寫者ID必填']
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'posts',
      required: [true, '貼文ID必填'],
    },
  },
  {
    versionKey: false,
    timestamps: {
      currentTime: () => Date.now()
    }
  }
)

// 前置器
CommentSchema.pre(/^find/, function(next){
  this.populate({
    path: 'user',
    select: 'id name avatar'
  });
  next();
});
const CommentModel = new mongoose.model('comment', CommentSchema);


module.exports = {
  CommentModel
}