
const asyncError = require('../utility/asyncError');
const successHandler = require('../utility/successHandler');
const { ImgurClient } = require('imgur');
const appError = require('../utility/appError');
const responseMessage = require('../utility/responseMessage');

const upload = {
  uploadImage: 
    asyncError(async(request, response, next) => {
      console.log(request.files.length<=0)
      if (request.files.length <= 0) {
        return next(appError(403, responseMessage.nofile, next))
      }
      const client = new ImgurClient({
        clientId: process.env.IMGUR_CLIENTID,
        clientSecret: process.env.IMGUR_CLIENT_SECRET,
        refreshToken: process.env.IMGUR_REFRESH_TOKEN,
      });
      const result = await client.upload({
        image: request.files[0]?.buffer.toString('base64'),
        type: 'base64',
        album: process.env.IMGUR_ALBUM_ID
      });
      successHandler(response, { url: result.data.link } );
    }),
}

module.exports = upload;