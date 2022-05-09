const successHandler = require('../utility/successHandler');
const errorHandler   = require('../utility/errorHandler');
const PostModel      = require('../models/posts');
const resMsg = require('../utility/responseMessage');

const posts = {
  async getPosts(request, response){
    const posts = await PostModel.getDB();
    successHandler(response, {data: posts});
  },


  async postPost(request, response){
    try {
      const data = request.body;
      if(!data.name || !data.name.trim()){
        errorHandler(response, 400, {message: resMsg.titleRequired});
        return;
      }
      if(!data.content || !data.content.trim()){
        errorHandler(response, 400, {message: resMsg.contentRequired});
        return;
      }
      data.name    = data.name.trim();
      data.content = data.content.trim();
      PostModel.postDB(data)
        .then(async(result) => 
          successHandler(response, {
            message: resMsg.postSuccess, 
            data: await PostModel.getDB()
          }))
        .catch(error => errorHandler(response, 400, {
          message: resMsg.postFail,
          error
        }));
    }
    catch(error) {
      errorHandler(response, 400, { 
        message: resMsg.wrongFormat, 
        error 
      });
    }
  },


  async patchPost(request,response){
    const id = request.params.postId;
    try {
      const data = request.body;
      if(data.name !== undefined){
        data.name = data.name.trim();
        if(!data.name) {
          errorHandler(response, 400, {message: resMsg.titleRequired});
          return;
        }
      }
      if(data.content !== undefined){
        data.content = data.content.trim();
        if(!data.content) {
          errorHandler(response, 400, {message: resMsg.contentRequired});
          return;
        }
      }
      PostModel.patchDB(id, data)
        .then(async(result) => {
          if(!result) {
            return errorHandler(response, 400, {
              message: resMsg.noItem,
            }); 
          }
          const posts = await PostModel.getDB()
          successHandler(response, {
            message: resMsg.patchSuccess,
            data: posts, 
          })
        })
        .catch(error => {
          errorHandler(response, 400, {
            // message: resMsg.patchFail,
            message: resMsg.wrongFormatOrNoItem, 
            error,
          }); 
        });
    }
    catch(error){
      errorHandler(response, 400, { 
        message: resMsg.wrongFormatOrNoItem, 
        error 
      });
    }
  },


  async deletePost(request,response){
    const id = request.params.postId;
    try {
      PostModel.deleteOneDB(id)
        .then(async(result) => {
          if(!result){
            errorHandler(response, 400, {
              message:resMsg.noItem,
            });   
          }
          const posts = await PostModel.getDB()
          successHandler(response, {
            message: resMsg.deleteSuccess,
            data: posts, 
          })
        })
        .catch(error => {
          errorHandler(response, 400, {
            // message:resMsg.deleteFail,
            message: resMsg.wrongFormatOrNoItem,
            error
          }); 
        });
    }
    catch(error){
      errorHandler(response, 400, {
        message: resMsg.wrongFormatOrNoItem,
        error
      })
    }
  },



  async deletePosts(request, response){
    PostModel.deleteAllDB()
      .then(() => successHandler(response, {
        message: resMsg.deleteAllSuccess, 
        data: []
      }))
      .catch(error => errorHandler(response, 400, {
        message: resMsg.deleteAllFail, 
        error
      }));
  },
};


module.exports = posts;
