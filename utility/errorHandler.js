const errorHandler = ({response, statusCode, content}) => {
  response
  .status(statusCode)
  .send({
    status: false,
    ...content,
  })
  .end();
}


module.exports = errorHandler;