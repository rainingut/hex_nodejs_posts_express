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
    likes: Number,
    comment: Number,
    createdAt: Date,
    type: [String],
    tags: [String],
  },
  {versionKey: false}
);

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
  const result = await PostModel.findByIdAndUpdate(_id, data);
  return result;
}

const existsDB = async(_id) => {
  const result = await PostModel.findOne({_id});
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