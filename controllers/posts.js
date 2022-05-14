const successHandler = require('../utility/successHandler');
const PostModel      = require('../models/posts');
const UserModel      = require('../models/users');
const resMsg = require('../utility/responseMessage');
const appError = require('../utility/appError');
const validator = require('validator');

const posts = {
  async getPosts(request, response, next){
    const query    = request.query;
    const timeSort = query.timeSort==='desc' ? '-createdAt' : 'createdAt';
    const keyword  = query.q===undefined ? {} : { content :new RegExp(query.q) };
    const posts = await PostModel.getAllDB(keyword, timeSort)
    successHandler(response, {data: posts});
  },

  async getPost(request, response, next){
    const id = request.params.postId;
    const post = await PostModel.getOneDB(id)
    if (post) {
      successHandler(response, { data: post });
    }
    else {
      return appError(400, resMsg.noItem, next);
    }
  },

  async postPost(request, response, next){
    const data = request.body;
    if(!data.name || !data.name.trim() ){
      return appError(400, resMsg.titleRequired, next);
    }
    if(!data.content || !data.content.trim() ){
      return appError(400, resMsg.contentRequired, next);
    }
    if(data.image) {
      if( !validator.isURL(data.image) || !data.image.toString().match(/(\S+?(?:jpe?g|png|gif|webp))$/) )
        appError(400, resMsg.imageNotMatch, next);
    }

    const user = await UserModel.getOneDB(data.user)
    if(!user){
      return appError(400, resMsg.noUser, next);
    }

    data.name    = data.name.trim();
    data.content = data.content.trim();
    const newPost = await PostModel.postDB(data)
    if (!newPost) {
      return appError(400, resMsg.postFail, next);
    }
    successHandler(response, {
      message: resMsg.postSuccess, 
      data: newPost,
    });
  },


  async patchPost(request, response, next){
    const id = request.params.postId;
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
    const editPost = await PostModel.patchDB(id, data);
    if (!editPost) {
      return appError(400, resMsg.wrongFormatOrNoItem, next);
    }
    successHandler(response, {
      message: resMsg.patchSuccess,
    })

  },


  async deletePost(request, response, next){
    const id = request.params.postId;
    const deletePost = await PostModel.deleteOneDB(id)
    if(!deletePost){
      return appError(400, resMsg.wrongFormatOrNoItem, next);
    }
    successHandler(response, {
      message: resMsg.deleteSuccess,
    })
  },


  async deletePosts(request, response, next){
    if(request.originalUrl === '/posts/'){
      return appError(400, resMsg.noItem, next);
    }
    const deleteAll = await PostModel.deleteAllDB();
    if(!deleteAll){
      return appError(400, resMsg.deleteAllFail, next);
    }
    successHandler(response, {
      message: resMsg.deleteAllSuccess, 
      data: []
    })
  },
};


module.exports = posts;
