const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name 必填'] 
    },
    image: String,
    content: {
      type: String,
      required: [true, '內容必填']
    },
    likes: {
      type: Number,
      default: 0
    },
    comment: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
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
  {versionKey: false}
);;

const PostModel = new mongoose.model('posts', postSchema);


const getDB = async() => {
  const result = await PostModel.find();
  return result;
}

const deleteAllDB = async () => {
  const result = await PostModel.deleteMany();
  return result;
}

const deleteOneDB = async (_id) => {
  const result = await PostModel.findByIdAndDelete(_id);
  return result;
}

const postDB = async(post) => {
  const result = await PostModel.create(post);
  return result;
}

const patchDB = async(_id, data) => {
  // 感謝二周目助教：findByIdAndUpdate第三個參數{ runValidators: true }，讓 findByIdAndUpdate 也可以跑 Schema 驗證規則。
  const result = await PostModel.findByIdAndUpdate(_id, data, { runValidators: true });
  return result;
}

const existsDB = async(_id) => {
  const result = await PostModel.findById(_id);
  return result;
}

module.exports = {
  // PostModel
  getDB,
  postDB,
  patchDB,
  deleteOneDB,
  deleteAllDB,
  existsDB,
};