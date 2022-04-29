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

app.use('/posts', postsRouter);                   // 使用 posts 路由
app.use('/users', usersRouter);
app.use(function(request, response, next){            // middle 查無此頁面
	response.status(404).send(responseMessage.noPage);
});

module.exports = app;
