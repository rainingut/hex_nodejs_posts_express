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

const userModel = new mongoose.model('users', userSchema);


const getAllDB = async() => {
  const result = await userModel.find();
  return result;
}

const getOneDB = async(_id) => {
  const result = await userModel.findById(_id);
  return result;
}

const deleteAllDB = async () => {
  const result = await userModel.deleteMany();
  return result;
}

const deleteOneDB = async (_id) => {
  const result = await userModel.findByIdAndDelete(_id);
  return result;
}

const postDB = async(user) => {
  const result = await userModel.create(user);
  return result;
}

const patchDB = async(_id, data) => {
  const result = await userModel.findByIdAndUpdate(_id, data, { runValidators: true });
  return result;
}

const existsDB = async(_id) => {
  const result = await userModel.findById(_id);
  return result;
}

const accountExistDB = async(email) => {
  const result = await userModel.findOne({email});
  return result;
}

module.exports = {
  // UserModel
  getAllDB,
  getOneDB,
  postDB,
  patchDB,
  deleteOneDB,
  deleteAllDB,
  existsDB,
  accountExistDB,
};