const appError = function ( statusCode, message, next ) {
  const error      = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true; // 這是自定義的(可預期的錯誤)
  next(error);                // 傳到 app.js，錯誤處理
}

module.exports = appError;