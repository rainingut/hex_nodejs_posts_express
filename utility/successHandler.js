const successHandler = (response, content) => {
  if(content) {
    response.send({
      status: true,
      ...content
    });
  }
  response.end();
}

module.exports = successHandler;