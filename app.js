var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

const postsRouter = require('./routes/posts');           // 引入 posts 路由
const usersRouter = require('./routes/users');           // 引入 users 路由
const uploadRouter = require('./routes/upload'); 				 // 引入 upload 路由
const responseMessage = require('./utility/responseMessage'); // 回覆訊息

const swaggerUi   = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

var app = express();
require('./connections');                             // 連線資料庫

app.use(cors());                                      // 使用cors(headers)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// 程式出現重大錯誤(非預期錯誤)
process.on('uncaughtException', (error) => {
	console.error('UncaughtException!');
	console.dir(error);
	process.exit(1);
	// https://medium.com/@elton-lau/48f364ebeb4e
	// https://nodejs.dev/learn/how-to-exit-from-a-nodejs-program
	// https://nodejs.org/api/process.html#process_exit_codes
})

// 使用路由
app.use('/posts', postsRouter); 
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));


// middle 404 查無此頁面
app.use(function(request, response, next){            
	response.status(404).send({status: false, message: responseMessage.noPage});
});


// middle 500 伺服器錯誤
// development
const devResError = function(error, response){
	const { message, stack } = error;
	response.status(error.statusCode).send({
		status: false,
		error,
		message,
		stack,
	});
}
// production
const prodResError = function(error, response){
	console.log(error);
	// 可預期的錯誤
	if(error.isOperational){
		response.status(error.statusCode).send({
			status: false,
			message: error.message,
		});
	}
	// 非預期的錯誤
	else {
		response.status(500).send({
			status: false,
			message: responseMessage.somethingWrong,
		});
	}
}
// choose dev | prod
app.use(function(error, request, response, next){
	error.statusCode = error.statusCode || 500;
	// development
	if(process.env.NODE_ENV === 'dev') {
		return devResError(error, response);
	}
	// production
	// ObjectId
	if (error.kind === 'ObjectId') {
		error.statusCode = 400;
		error.isOperational = true;
		error.message = responseMessage.noItem;
		return prodResError(error, response);	
	}
	// validator
	if(error.message === 'ValidationError'){
		error.statusCode = 400;
		error.isOperational = true;
		error.message = responseMessage.wrongFormat;
		return prodResError(error, response);
	}
	// invalid signature
	if(error.message === 'invalid signature'){
		error.statusCode = 403;
		error.isOperational = true;
		error.message = `token 錯誤`;
		return prodResError(error, response);
	}
	// not validator
	return prodResError(error, response);
});


// 非同步錯誤
process.on('unhandledRejection', (error, promise) => {
	console.error('未捕捉到的 rejection：', promise, '原因：', error);
});



module.exports = app;
