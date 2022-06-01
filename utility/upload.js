
const responseMessage = require('./responseMessage');
const multer = require('multer');
const path = require('path');

const errorHandler = (message, statusCode = 403) => {
  const error = new Error(message);
  error.statusCode = 403;
  error.isOperational = true;
  return error;
}

const upload = {
  uploadImage: 
    multer({
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
      fileFilter(req, file, cb) {
        const imgeExts = ['.jpg', '.png'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!imgeExts.some(i => i === ext)) {
          cb(errorHandler(responseMessage.imageFormat));
        }
        cb(null, true); // 像 middleware
      },
    }).any(),
}

module.exports = upload;