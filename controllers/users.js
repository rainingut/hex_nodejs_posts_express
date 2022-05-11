const validator = require('validator');
const successHandler = require('../utility/successHandler');
const errorHandler = require('../utility/errorHandler');
const UserModel = require('../models/users');
const PostModel = require('../models/posts');
const resMsg = require('../utility/responseMessage');

const users = {
  async getUsers(request, response, next) {
    const users = await UserModel.getAllDB();
    successHandler(response, { data:users });
  },

  async getUser(request, response, next){
    const id = request.params.userId;
    try {
      await UserModel.getOneDB(id)
        .then(result => {
          result
          ? successHandler(response, { data: result })
          : errorHandler(response, 400, {
            message: resMsg.noItem, 
          });
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
        message: resMsg.noItem
      });
    }
  },

  // 註冊會員
  async addUser(request, response, next){
    try{
      let {name, email, password, confirmPsw, sex} = request.body;
      const isEmail = validator.isEmail(email);
      const isPswLength = validator.isLength(password, {min: 6});
      if(!name || !email || !password){
        if(!name){
          return errorHandler(response, 400, {message: resMsg.nameRequired});
        }
        if(!email){
          return errorHandler(response, 400, {message: resMsg.emailRequired});
        }
        if(!password){
          return errorHandler(response, 400, {message: resMsg.passwordRequired});
        }
      }
      if(!isEmail || !isPswLength ) {
        if(!isEmail){
          return errorHandler(response, 400, {message: resMsg.emailFormat});
        }
        if(!isPswLength){
          return errorHandler(response, 400, {message: resMsg.pswAtLeastSix});
        }
      }
      if(password !== confirmPsw){
        return errorHandler(response, 400, {message: resMsg.passwordWroung});
      }
      // 帳號註冊過了嗎
      const isAccountExist = await UserModel.accountExistDB(email)
        .catch(error => errorHandler(response, 400, {message: resMsg.wrongFormatOrNoItem, error}) );
      if(!isAccountExist) {
        await UserModel.postDB({name, email, password, })
          .then(result => {
            return successHandler(response, { 
              message: resMsg.postSuccess, 
              data: result 
            });
          })
          .catch(error => 
            errorHandler(response, 400, {message: resMsg.postFail, error})
          );
      }
      else {
        return errorHandler(response, 400, {message: resMsg.accoundAlreadExist});
      }

    }
    catch(error){
      errorHandler(response, 400, {
        message: resMsg.wrongFormatOrNoItem,
        error,
      });
    }
  },

  async deleteUsers(request, response, next){
    if(request.originalUrl === '/users/'){
      return errorHandler(response, 400, {
        message: resMsg.noItem, 
      });
    }
    // 全部貼文刪除
    await PostModel.deleteAllDB()
    .catch(error => errorHandler(response, 400, {
      message: resMsg.deleteAllFail, 
      error
    }));
    // 全部使用者刪除
    await UserModel.deleteAllDB()
      .then(() => successHandler(response, {
        message: resMsg.deleteAllSuccess, 
        data: []
      }))
      .catch(error => errorHandler(response, 400, {
        message: resMsg.deleteAllFail, 
        error
      }));
  },
  
  async editUser(request, response, next){
    const id = request.params.userId;
    try{
      let { name, sex, avatar } = request.body;
      const data = {};
      if(name !== undefined){
        name = name.trim();
        !name
          ? errorHandler(response, 400, {message: resMsg.nameRequired})
          : data.name = name;
      }
      if(avatar !== undefined){
        avatar = avatar.trim();
        //https://stackoverflow.com/questions/65102302/
        !avatar.toString().match(/(\S+?(?:jpe?g|png|gif|webp))$/)
          ? errorHandler(response, 400, {message: resMsg.imageNotMatch})
          : data.avatar = avatar;
      }
      if (sex !== undefined) {
        if (sex !== 'male' && sex !== 'female') {
          errorHandler(response, 400, {message: resMsg.sexNotMatch});
        }
        else {
          data.sex = sex;
        }
      }
      await UserModel.patchDB(id, data)
      .then(async result => {
        if (!result) {
          return errorHandler(response, 400, {message: resMsg.noItem, error});
        }
        const users = await UserModel.getAllDB();
        successHandler(response, {
          message: resMsg.patchSuccess, 
          data: users
        });
      })
      .catch(error => errorHandler(response, 400, {
        message: resMsg.wrongFormatOrNoItem, 
        error
      })  );
    }
    catch(error){
      errorHandler(response, 400, {message: resMsg.wrongFormatOrNoItem, error});
    }
  },
  
  async deleteUser(request, response, next){
    const id = request.params.userId;
    try {
      UserModel.deleteOneDB(id)
        .then(async(result) => {
          if(!result){
            errorHandler(response, 400, {
              message:resMsg.noItem,
            });
          }

          // 刪該使用者的POSTs
          const posts = await PostModel.getAllDBByuserId(id)
            .catch(error => errorHandler(response, 400, {
              message: resMsg.somethingWrong,
              error
            })  );
          await posts.forEach(async post => {
            await PostModel.deleteOneDB(post._id)
              .catch(error => {
                errorHandler(response, 400, {
                  message: resMsg.somethingWrong,
                  error
                }); 
              })
          });
          
          const users = await UserModel.getAllDB()
          successHandler(response, {
            message: resMsg.deleteSuccess,
            data: users, 
          });
        })
        .catch(error => {
          errorHandler(response, 400, {
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
};

module.exports = users;