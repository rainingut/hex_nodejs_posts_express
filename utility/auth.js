const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const successHandler = require('./successHandler');
const { UserModel } = require('../models/users');
const responseMessage = require('./responseMessage');
const appError = require('./appError');
const asyncError = require('./asyncError');

// 密碼加密
const encodePsw = async function (text) {
	const result = await bcrypt.hash(text , 12);
	return result;
}

// 密碼比對
const comparePsw  = async function (password, userPsw){
	const result = await new Promise((resolve, reject) =>bcrypt.compare(
    password, 
    userPsw, 
		function(error, response){ 
      return error
        ? reject(error)
        : resolve(response)
    }
	));
  return result;
}

// 生成 token
const generateSendJWT = (response, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY
  });
  user.password = undefined;
  successHandler(response, {
    user: {
      token,
      name: user.name
    }
  });
}

// 比對 token
const isAuth = asyncError(async(request, response, next) => {
  const auth = request.headers.authorization;
  if(!auth || !auth.split(' ')[1]){
    return next(appError(403, responseMessage.noSignIn, next));
  }
  const token = auth.split(' ')[1];
  const result = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, 
      (error, payload) => {
        if( error ) { reject(error); }
        else { resolve(payload); }
      }  
    )
  });
  request.user = await UserModel.findById(result?.id).select('id email name permission');
  next();
})

// 看看權限
const isAdmin = asyncError(async(request, response, next) => {
  const permission = request.user.permission;
  if(permission !== 'admin') {
    return appError(403, responseMessage.noAdmin, next);
  }
  next();
})

module.exports = {
  generateSendJWT,
  isAuth,
  isAdmin,
  encodePsw,
  comparePsw,
}