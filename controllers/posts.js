const successHandler = require('../utility/successHandler');
const { PostModel }      = require('../models/posts');
const { UserModel }      = require('../models/users');
const resMsg = require('../utility/responseMessage');
const appError = require('../utility/appError');
const validator = require('validator');
const asyncError = require('../utility/asyncError');

const posts = {
  // 取得所有貼文列表
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
  
  // 取得單一貼文 :postId
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

  // 新增一筆貼文
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

  // 修改一筆貼文 :postId
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
      const editPost = await PostModel.findByIdAndUpdate(id, data, 
        {runValidators: true,  returnDocument: 'after',}
      );
      if (!editPost) {
        return appError(400, resMsg.wrongFormatOrNoItem, next);
      }
      successHandler(response, {
        message: resMsg.patchSuccess,
        data: editPost
      })
  
    }
  ),

  // 刪除一筆貼文 :postId
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

  // 刪除所有貼文
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
  ),

  // 取得單一使用者貼文列表
  getOneUserPosts: asyncError(
    async(request, response, next) => {
      const userId = request.params.userId;
      if (!userId) {
        return next(appError(403, resMsg.noUser, next));
      }
      const posts = await PostModel
        .find({ user: userId })
        .populate({
          path: 'user',
          select: 'id name',
        })
      if (!posts) {
        return next(appError(400, resMsg.noItem))
      }
      successHandler(response, { data: posts });
  }
  ),

  // 按讚 :postId/like
  addLike: asyncError(
    async (request, response, next) => {
      const postId = request.params.postId;
      if (!postId) {
        return next(appError(400, resMsg.noItem, next))
      }
      const post = await PostModel.findByIdAndUpdate(
        { _id: postId },
        { $addToSet: {likes: request.user.id } },
        { runValidators: true,  returnDocument: 'after' }
      );
      if (!post) {
        return next(appError(400, resMsg.wrongFormatOrNoItem, next));
      }
      successHandler(response, { 
        message: resMsg.postSuccess,
        data: post 
      });
    }
  ),

  // 取消按讚 :postId/unlike
  deleteLike: asyncError(
    async (request, response, next) => {
      const postId = request.params.postId;
      if (!postId) {
        return next(appError(400, resMsg.noItem, next))
      }
      const post = await PostModel.findByIdAndUpdate(
        { _id: postId },
        { $pull: { likes: request.user.id } },
        { runValidators: true, returnDocument: 'after' }
      );
      if (!post) {
        return next(appError(400, resMsg.wrongFormatOrNoItem, next));
      }
      successHandler(response, {
        message: resMsg.deleteSuccess,
        data: post,
      })
    }
  ),

};


module.exports = posts;
