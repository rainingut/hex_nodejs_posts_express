var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var postsRouter = require('./routes/posts');           // 引入 posts 路由
var usersRouter = require('./routes/users');
const responseMessage = require('./utility/responseMessage'); // 回覆訊息

var app = express();
require('./connections');                             // 連線資料庫

app.use(cors());                                      // 使用cors(headers)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// 程式出現重大錯誤
process.on('uncaghtException', err => {
	console.error('UncaughtException!');
	console.error(err);
	process.exit(1);
})
// 使用路由
app.use('/posts', postsRouter); 
app.use('/users', usersRouter);
// middle 查無此頁面
app.use(function(request, response, next){            
	response.status(404).send({status: false, message: responseMessage.noPage});
});
// 非同步錯誤
process.on('unhandledRejection', function(reason, promise){
	console.error('未捕捉到的 rejection：', promise, '原因：', reason);
});



module.exports = app;
