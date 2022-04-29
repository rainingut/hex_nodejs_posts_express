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
      PostModel.postDB(data)
        .then(async(result) => 
          successHandler(response, {
            message: resMsg.postSuccess, 
            data: await PostModel.getDB()
          }))
        .catch(error => errorHandler({response, statusCode:400, content:{
          message: resMsg.postFail,
          error
        }}));
    }
    catch(error) {
      errorHandler({response, statusCode: 400, content: { 
        message: resMsg.wrongFormat, 
        error 
      }});
    }
  },


  async patchPost(request,response){
    // const id = request.url.split('/').pop();
    const id = request.params.postId;
    await PostModel.existsDB(id)
      .catch(error => {errorHandler(  {response, statusCode:400, content:{
        message: resMsg.noItem, error
      }}  );});
    try {
      const data = request.body;
      PostModel.patchDB(id, data)
        .then(async(result) => {
          console.log(result)
          const posts = await PostModel.getDB()
          successHandler(response, {
            message: resMsg.patchSuccess,
            data: posts, 
          })
        })
        .catch(error => {
          errorHandler({response, statusCode:400, content:{
            message: resMsg.patchFail,
            error,
          }}); 
        });
    }
    catch(error){
      errorHandler({response, statusCode: 400, content: { 
        message: resMsg.wrongFormat, 
        error 
      }});
    }
  },


  async deletePost(request,response){
    // const id = request.url.split('/').pop();
    const id = request.params.postId;
    await PostModel.existsDB(id)
    .catch(error => errorHandler(  {response, statusCode:400, content:{
      message: resMsg.noItem, error
    }}  ));
    PostModel.deleteOneDB(id)
      .then(async(result) => {
        const posts = await PostModel.getDB()
        successHandler(response, {
          message: resMsg.deleteSuccess,
          data: posts, 
        })
      })
      .catch(error => {
        errorHandler({response, statusCode:400, content:{
          message:resMsg.deleteFail,
          error
        }}); 
      });
  },



  async deletePosts(request, response){
    PostModel.deleteAllDB()
      .then(() => successHandler(response, {
        message: resMsg.deleteAllSuccess, 
        data: []
      }))
      .catch(error => errorHandler({response, statusCode:400, content:{
        message: resMsg.deleteAllFail, 
        error
      }}));
  },
};


module.exports = posts;
