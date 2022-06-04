const validator = require('validator');
const successHandler = require('../utility/successHandler');
const { UserModel } = require('../models/users');
const { PostModel } = require('../models/posts');
const resMsg = require('../utility/responseMessage');
const appError = require('../utility/appError');
const  asyncError = require('../utility/asyncError');
const { comparePsw, generateSendJWT, encodePsw } = require('../utility/auth');

const users = {
  getUsers: asyncError(
    async (request, response, next) => {
      const users = await UserModel.find().select('+email');
      successHandler(response, { data:users });
    }
  ),

  getUser: asyncError(
    async (request, response, next) => {
      const userId = request.user?.id;
      const user = await UserModel.findById(userId).select('id name');
      if(!user){
        return appError(400, resMsg.noUser, next);
      }
      successHandler(response, { data: user });
    }
  ),

  // 註冊會員
  addUser: asyncError( 
    async (request, response, next) => {
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
      const isAccountExist = await UserModel.findOne({email});
      if(!isAccountExist) {
        password = await encodePsw(password);
        const newUser = await UserModel.create({name, email, password, })
        if(!newUser) {
          return appError(400, resMsg.postFail, next);
        }
        successHandler(response, { 
          message: resMsg.postSuccess, 
          data: {
            id: newUser?.id,
            name: newUser?.name,
            email: newUser?.email,
          }
        })
      }
      else {
        return appError(400, resMsg.accoundAlreadExist, next);
      }
    }
  ),

  deleteUsers: asyncError(
    async (request, response, next) => {
      if(request.originalUrl === '/users/'){
        return appError(400, resMsg.noItem, next);
      }
      // 全部貼文刪除
      await PostModel.deleteMany();
      // 全部使用者刪除
      const deleteAll = await UserModel.deleteMany()
      if(!deleteAll){
        return appError(400, resMsg.deleteAllFail, next);
      }
      successHandler(response, {
        message: resMsg.deleteAllSuccess, 
        data: []
      })
    }
  ),
  
  /**
   * 變更使用者個人資訊
   */
  editUser: asyncError(
    async(request, response, next) => {
      const id = request.user?.id;
      let { name, sex, avatar } = request.body;
      name = name?.trim();
      avatar = avatar?.trim();
      const data = {};
      if(!name){
        return next(appError(400, resMsg.nameRequired, next))
      }
      else{
        data.name = name;
      }
      
      if (sex !== undefined) {
        if (sex !== 'male' && sex !== 'female') {
          return appError(400, resMsg.sexNotMatch, next);
        }
        else {
          data.sex = sex;
        }
      }
      //https://stackoverflow.com/questions/65102302/
      if(avatar)
      {if(!avatar?.toString()?.match(/(\S+?(?:jpe?g|png|gif|webp))$/)){
        return next(appError(400, resMsg.imageNotMatch, next))
      }}
      else {
        data.avatar = avatar;
      }
      const editUser = await UserModel.findByIdAndUpdate(id, data, { runValidators: true });
      if(!editUser) {
        return appError(400, resMsg.patchFail, next);
      }
      successHandler(response, {
        message: resMsg.patchSuccess,
      });
    }
  ),

  /**變更密碼 */
  updatePassword: asyncError(
    async (request, response, next) => {
      let { password, confirmPsw } = request.body;
      const id = request.user?.id;
      password = password?.trim();
      confirmPsw = confirmPsw?.trim();
      if(!password || !confirmPsw) {
        return appError(400, resMsg.passwordRequired, next);
      }
      if(password !== confirmPsw) {
        return appError(400, resMsg.passwordWroung, next);
      }
      const newPsw = await encodePsw(password);
      const editPsw = await UserModel.findByIdAndUpdate(id, {newPsw}, { runValidators: true });
      if(!editPsw) {
        return next(appError(400, resMsg.patchFail, next));
      }
      successHandler(response, { message: resMsg.patchSuccess, });
    }
  ),
  
  deleteUser: asyncError(
    async (request, response, next) => {
      const id = request.params.userId;
      const user = request.user;
      // 不能刪除自己
      if(id === user?.id){
        return appError(400, resMsg.cantSelf, next);
      }
      const deleteUser = await UserModel.findByIdAndDelete(id);
      if(!deleteUser){
        return appError(400, resMsg.wrongFormatOrNoItem, next);
      }
      // 刪該使用者的POSTs
      const posts = await PostModel.find({user: id})
      await posts.forEach(async post => {
        await PostModel.findByIdAndDelete(post._id);
      });
      successHandler(response, {
        message: resMsg.deleteSuccess,
      });
    }
  ),

  signIn: asyncError(
    async(request, response, next) => {
      const { email, password } = request.body;
      const errorMsg = [];
      if(!email || !password) {
        if(!email || !email.trim()){
          errorMsg.push(resMsg.emailRequired)
        }
        if(!password || !password.trim()){
          errorMsg.push(resMsg.passwordRequired)
        }
      }
      // 輸入不完整
      if(errorMsg.length>0){
        return next(appError(403, errorMsg, next));
      }
      // 查詢此用戶
      const user = await UserModel.findOne({email}).select('+password');
      if(!user) {
        return next(appError(400, resMsg.noUser, next));
      }
      // 密碼對不對
      // console.log(password, user?.password)
      const isPsw = await comparePsw(password, user.password);
      // console.log(isPsw)
      if(!isPsw) {
        return next(appError(403, resMsg.passwordWroung, next));
      }
      generateSendJWT(response, user);
    }
  ),

  // 按讚列表
  getLikeList: asyncError(
    async(request, response, next) => {
      const userId = request?.user?.id;
      if (!userId) {
        return next(appError(400, resMsg.noUser, next));
      }
      const likes = await PostModel.find({likes:{$in: [userId]}})
      .select('name user createdAt')
      .populate({
        path: 'user',
        select: 'name avatar'
      })
      successHandler(response, { data: likes });
    }
  ),

  // 取得個人追蹤名單
  getFollowings: asyncError(
    async(request, response, next) => {
      const userId = request.user?.id;
      const followings = await UserModel.findById(userId)
        .select('followings')
        .populate({
          path: 'followings.user',
          select: 'id name avatar'
        })
      if (!followings) {
        return next(appError(400, resMsg.FAIL, next));
      }
      successHandler(response, {
        data: followings
      })
    }
  ),

  // 加入追蹤
  addFollowing: asyncError(
    async(request, response, next) => {
      const currentUserId = request.user?.id;
      const otherUserId   = request.params.userId;
      if (currentUserId === otherUserId){
        return next(appError(400, `不能追蹤自己`, next));
      }
      const following = await UserModel.findOneAndUpdate(
        { 
          _id: currentUserId, 
          'followings.user': {$ne: otherUserId} 
        },
        {
          $addToSet: {followings: {user: otherUserId}}
        },
        {
          runValidators: true, returnDocument: 'after'
        }
      );
      if (!following) {
        return next(appError(400, `加入追蹤失敗`, next));
      }
      const follower = await UserModel.findOneAndUpdate(
        {
          _id: otherUserId,
          'followers.user': {$ne: currentUserId} 
        },
        {
          $addToSet: {followers: {user: currentUserId}}
        }
      );
      if (!follower) {
        return next(appError(400, `加入追蹤失敗`, next));
      }
      successHandler(response, {
        message: '成功加入追蹤',
        data: following
      });
    }
  ),

  // 取消追蹤
  deleteFollowing: asyncError(
    async(request, response, next) => {
      const currentUserId = request.user?.id;
      const otherUserId   = request.params.userId;
      if (currentUserId === otherUserId){
        return next(appError(400, `不能對自己作用`, next));
      }
      const unfollowing = await UserModel.findOneAndUpdate(
        { 
          _id: currentUserId, 
        },
        {
          $pull: {followings: {user: otherUserId}}
        },
        {
          runValidators: true, returnDocument: 'after'
        }
      );
      if (!unfollowing) {
        return next(appError(400, `取消追蹤失敗`, next));
      }
      const unfollower = await UserModel.findOneAndUpdate(
        {
          _id: otherUserId,
        },
        {
          $pull: {followers: {user: currentUserId}}
        }
      );
      if (!unfollower) {
        return next(appError(400, `取消追蹤失敗`, next));
      }
      successHandler(response, {
        message: '成功取消追蹤',
        data: unfollowing
      });
    }
  ),
};

module.exports = users;