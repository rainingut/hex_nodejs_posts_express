const successHandler = require('../utility/successHandler');
const { PostModel }      = require('../models/posts');
const { UserModel }      = require('../models/users');
const resMsg = require('../utility/responseMessage');
const appError = require('../utility/appError');
const validator = require('validator');
const asyncError = require('../utility/asyncError');

const posts = {
  getPosts: asyncError(
    async (request, response, next) => {
      const query    = request.query;
      const timeSort = query.timeSort==='desc' ? '-createdAt' : 'createdAt';
      const keyword  = query.q===undefined ? {} : { content :new RegExp(query.q) };
      const posts = await PostModel.find(keyword)
        .sort(timeSort)
        .populate({
          path: 'user',
          select: 'id name',
        })
      successHandler(response, {data: posts});
    }
  ),
  
  getPost: asyncError(
    async (request, response, next) => {
      const id = request.params.postId;
      const post = await PostModel.findById(id)
      if (post) {
        successHandler(response, { data: post });
      }
      else {
        return appError(400, resMsg.noItem, next);
      }
    }
  ),

  postPost: asyncError(
    async (request, response, next) => {
      const data = request.body;
      const user = request?.user;
      data.name    = data?.name.trim();
      data.content = data?.content.trim();
      data.user    = user?.id;
      if(!data.name){
        return appError(400, resMsg.titleRequired, next);
      }
      if(!data.content ){
        return appError(400, resMsg.contentRequired, next);
      }
      if(data.image) {
        if( !validator.isURL(data.image) || !data.image.toString().match(/(\S+?(?:jpe?g|png|gif|webp))$/) )
          appError(400, resMsg.imageNotMatch, next);
      }
      if(!user){
        return appError(400, resMsg.noUser, next);
      }
      // console.log(data)
      const newPost = await PostModel.create(data)
      if (!newPost) {
        return appError(400, resMsg.postFail, next);
      }
      successHandler(response, {
        message: resMsg.postSuccess, 
        data: newPost,
      });
    }
  ),

  patchPost: asyncError(
    async (request, response, next) => {
      const id = request.params.postId;
      const user = request?.user;
      const data = request.body;
      if(data.name !== undefined){
        data.name = data.name.trim();
        if(!data.name) {
          return appError(400, resMsg.titleRequired, next);
        }
      }
      if(data.content !== undefined){
        data.content = data.content.trim();
        if(!data.content) {
          return appError(400, resMsg.contentRequired, next);
        }
      }
      if(data.image) {
        if( !validator.isURL(data.image) || !data.image.toString().match(/(\S+?(?:jpe?g|png|gif|webp))$/) ) {
          return appError(400, resMsg.imageNotMatch, next);
        }
      }
      
      const post = await PostModel.findById(id);
      if(!post){
        return next(appError(400, resMsg.noItem, next));
      }
      if(post?.user.toString() !== user?.id) {
        return next(appError(403, resMsg.noSelf, next));
      }
      // 感謝二周目助教-Timinitime Lin：findByIdAndUpdate第三個參數{ runValidators: true }，讓 findByIdAndUpdate 也可以跑 Schema 驗證規則。
      const editPost = await PostModel.findByIdAndUpdate(id, data, {runValidators: true});
      if (!editPost) {
        return appError(400, resMsg.wrongFormatOrNoItem, next);
      }
      successHandler(response, {
        message: resMsg.patchSuccess,
      })
  
    }
  ),

  deletePost: asyncError(
    async (request, response, next) => {
      const id = request.params.postId;
      const user = request?.user;
      const post = await PostModel.findById(id);
      if(!post){
        return next(appError(400, resMsg.noItem, next));
      }
      if(post?.user.toString() !== user?.id) {
        return next(appError(403, resMsg.noSelf, next));
      }
      const deletePost = await PostModel.findByIdAndDelete(id)
      if(!deletePost){
        return appError(400, resMsg.wrongFormatOrNoItem, next);
      }
      successHandler(response, {
        message: resMsg.deleteSuccess,
      })
    }
  ),

  deletePosts: asyncError(
    async (request, response, next) => {
      if(request.originalUrl === '/posts/'){
        return appError(400, resMsg.noItem, next);
      }
      const deleteAll = await PostModel.deleteMany();
      if(!deleteAll){
        return appError(400, resMsg.deleteAllFail, next);
      }
      successHandler(response, {
        message: resMsg.deleteAllSuccess, 
        data: []
      })
    },
  )
};


module.exports = posts;
