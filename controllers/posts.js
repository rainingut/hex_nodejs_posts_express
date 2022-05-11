const successHandler = require('../utility/successHandler');
const errorHandler   = require('../utility/errorHandler');
const PostModel      = require('../models/posts');
const UserModel      = require('../models/users');
const resMsg = require('../utility/responseMessage');

const posts = {
  async getPosts(request, response){
    const query    = request.query;
    const timeSort = query.timeSort===undefined ? '-createdAt' : 'createdAt';
    const keyword  = query.q===undefined ? {} : { content :new RegExp(query.q) };
    const posts = await PostModel.getAllDB(keyword, timeSort)
      .catch(error => errorHandler(response, 400, { message: resMsg.somethingWrong, error }));
    successHandler(response, {data: posts});
  },

  async getPost(request, response){
    const id = request.params.postId;
    try{
      await PostModel.getOneDB(id)
        .then(result => {
          !result
            ? errorHandler(response, 400, {
              message: resMsg.noItem,
              error
            })
            : successHandler(response, { data: result });
        })
        .catch(error => {
          errorHandler(response, 400, {
            message: resMsg.noItem,
            error
          });
        });
    }
    catch(error){
      errorHandler(response, 400, {
        message: resMsg.noItem,
        error
      })
    }
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
      if(data.image) {
        if( !data.image.toString().match(/(\S+?(?:jpe?g|png|gif|webp))$/) )
         errorHandler(response, 400, {message: resMsg.imageNotMatch}); 
      }

      const user = await UserModel.getOneDB(data.user)
        .catch(error => errorHandler(response, 400, { message: resMsg.noUser, error}));
      if(!user){
        return errorHandler(response, 400, { message: resMsg.noUser});
      }

      data.name    = data.name.trim();
      data.content = data.content.trim();
      PostModel.postDB(data)
        .then(async(result) => 
          successHandler(response, {
            message: resMsg.postSuccess, 
            data: await PostModel.getAllDB()
          }))
        .catch(error => {
          errorHandler(response, 400, {
            message: resMsg.postFail,
            error
          })
        });
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
          const posts = await PostModel.getAllDB()
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
          const posts = await PostModel.getAllDB()
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
    if(request.originalUrl === '/posts/'){
      return errorHandler(response, 400, {
        message: resMsg.noItem, 
      });
    }
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
