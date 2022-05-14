const validator = require('validator');
const successHandler = require('../utility/successHandler');
const UserModel = require('../models/users');
const PostModel = require('../models/posts');
const resMsg = require('../utility/responseMessage');
const appError = require('../utility/appError');

const users = {
  async getUsers(request, response, next) {
    const users = await UserModel.getAllDB();
    successHandler(response, { data:users });
  },

  async getUser(request, response, next){
    const id = request.params.userId;
    const user = await UserModel.getOneDB(id);
    if(!user){
      return appError(400, resMsg.noUser, next);
    }
    successHandler(response, { data: user });
  },

  // 註冊會員
  async addUser(request, response, next){
    let {name, email, password, confirmPsw, sex} = request.body;
    const isEmail = validator.isEmail(email);
    const isPswLength = validator.isLength(password, {min: 6});
    if(!name || !email || !password){
      if(!name){
        return appError(400, resMsg.nameRequired, next);
      }
      if(!email){
        return appError(400, resMsg.emailRequiredk, next);
      }
      if(!password){
        return appError(400, resMsg.passwordRequired, next);
      }
    }
    if(!isEmail || !isPswLength ) {
      if(!isEmail){
        return appError(400, resMsg.emailFormat, next);
      }
      if(!isPswLength){
        return appError(400, resMsg.pswAtLeastSix, next);
      }
    }
    if(password !== confirmPsw){
      return appError(400, resMsg.passwordWroung, next);
    }
    // 帳號註冊過了嗎
    const isAccountExist = await UserModel.accountExistDB(email);
    if(!isAccountExist) {
      const newUser = await UserModel.postDB({name, email, password, })
      if(!newUser) {
        return appError(400, resMsg.postFail, next);
      }
      successHandler(response, { 
        message: resMsg.postSuccess, 
        data: newUser
      })
    }
    else {
      return appError(400, resMsg.accoundAlreadExist, next);
    }
  },

  async deleteUsers(request, response, next){
    if(request.originalUrl === '/users/'){
      return appError(400, resMsg.noItem, next);
    }
    // 全部貼文刪除
    await PostModel.deleteAllDB();
    // 全部使用者刪除
    const deleteAll = await UserModel.deleteAllDB()
    if(!deleteAll){
      return appError(400, resMsg.deleteAllFail, next);
    }
    successHandler(response, {
      message: resMsg.deleteAllSuccess, 
      data: []
    })
  },
  
  async editUser(request, response, next){
    const id = request.params.userId;
    let { name, sex, avatar } = request.body;
    const data = {};
    if(name !== undefined){
      name = name.trim();
      !name
        ? appError(400, resMsg.nameRequired, next)
        : data.name = name;
    }
    if(avatar !== undefined){
      avatar = avatar.trim();
      //https://stackoverflow.com/questions/65102302/
      !avatar.toString().match(/(\S+?(?:jpe?g|png|gif|webp))$/)
        ? appError(400, resMsg.imageNotMatch, next)
        : data.avatar = avatar;
    }
    if (sex !== undefined) {
      if (sex !== 'male' && sex !== 'female') {
        return appError(400, resMsg.sexNotMatch, next);
      }
      else {
        data.sex = sex;
      }
    }
    const editUser = await UserModel.patchDB(id, data);
    if(!editUser) {
      return appError(400, resMsg.patchFail, next);
    }
    successHandler(response, {
      message: resMsg.patchSuccess, 
    });
  },
  
  async deleteUser(request, response, next){
    const id = request.params.userId;
    const deleteUser = UserModel.deleteOneDB(id)
    if(!deleteUser){
      return appError(400, resMsg.wrongFormatOrNoItem, next);
    }
    // 刪該使用者的POSTs
    const posts = await PostModel.getAllDBByuserId(id)
    await posts.forEach(async post => {
      await PostModel.deleteOneDB(post._id);
    });
    successHandler(response, {
      message: resMsg.deleteSuccess,
    });
  },
};

module.exports = users;