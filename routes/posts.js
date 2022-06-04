const express = require('express');
const router = express.Router();
const PostsController = require('../controllers/posts');
const { isAuth, isAdmin } = require('../utility/auth');

router
  .route('/')
  .get(PostsController.getPosts
    // #region 
    /**
      #swagger.tags = ['Posts']
      #swagger.description = '取得全部貼文資料'
      * https://medium.com/swlh/dd1ab3c78284
      #swagger.parameters['q']: {
        in: "query",
        description: '關鍵字查詢',
        required: false,
        type: "string",
        default: '測試',
        collectionFormat: 'multi'
      }
      #swagger.parameters['timeSort'] = {
        in: "query",
        name: "timeSort",
        description: '時間排序(asc:升冪、desc:降冪)',
        required: false,
        type: "string",
        default: 'desc'
      }
      #swagger.responses[200] = {
        description: '成功訊息',
        schema: {
          "status": true,
          "data": [
            {
              "_id": "627b3b1276cb9f85554f235f",
              "name": "測試一個",
              "image": null,
              "content": "我是測試內容",
              "user": {
                  "_id": "627b338faf6b9972e353ac19",
                  "name": "TESTMAN"
              },
              "likes": 0,
              "comment": 0,
              "type": [],
              "tags": [],
              "createdAt": "2022-05-11T04:26:58.802Z"
            }
          ]
        }
      }
    */ 
  // #endregion
  )
  .post(isAuth ,PostsController.postPost
    // #region
    /**
      #swagger.tags = ['Posts']
      #swagger.description = '新增單一貼文資料'
      #swagger.security = [{
        "AuthToken": []
      }]
      #swagger.parameters['body'] = {
        in: 'body',
        description: '資料格式',
        schema: {
          $user: "627fdc52360d4356588dccf1",
          $name : "測試一個", 
          $content:"我是測試內容",
          image: 'https://pngimg.com/uploads/telegram/telegram_PNG36.png'
        }
      }
      #swagger.responses[200] = {
        description: '成功回傳資訊',
        schema: {
          "status": true,
          "message": "新增成功",
          "data": [
            {
              "_id": "627b3aa376cb9f85554f2350",
              "name": "測試一個",
              "image": null,
              "content": "我是測試內容",
              "user": {
                "_id": "627b338faf6b9972e353ac19",
                "name": "TESTMAN"
              },
              "likes": 0,
              "comment": 0,
              "type": [],
              "tags": [],
              "createdAt": "2022-05-11T04:25:07.974Z"
            }
          ]
        }
      }
    */
  // #endregion
  )
  .delete(isAuth, isAdmin, PostsController.deletePosts
    // #region
    /**
      #swagger.tags = ['Posts']
      #swagger.description = '刪除全部貼文資料'
      #swagger.security = [{
        "AuthToken": []
      }]
      #swagger.responses[200] = {
        description: '成功訊息',
        schema: {
          "status": true,
          "message": "全部項目刪除成功",
          "data": []
        }
      }
    */
  // #endregion
  );

// 取得個人所有貼文列表
router.get('/user/:userId', PostsController.getOneUserPosts);

router
  .route('/:postId')
  .get(PostsController.getPost
    // #region
    /*
      #swagger.tags = ['Posts']
      #swagger.description = '取得單一貼文資料'
      #swagger.responses[200] = {
        description: '成功訊息',
        schema: {
          "status": true,
          "data": {
            "_id": "627b3b1276cb9f85554f235f",
            "name": "測試一個",
            "image": null,
            "content": "我是測試內容",
            "user": "627b338faf6b9972e353ac19",
            "likes": 0,
            "comment": 0,
            "type": [],
            "tags": [],
            "createdAt": "2022-05-11T04:26:58.802Z"
          }
        }
      }
    */
  // #endregion
  )
  .patch(isAuth ,PostsController.patchPost
    // #region  swagger
    /*
      #swagger.tags = ['Posts']
      #swagger.description = '修改單一貼文資料'
      #swagger.security = [{
        "AuthToken": []
      }]
      #swagger.responses[200] = {
        description: '成功訊息',
        schema: {
          "status": true,
          "message": "更新成功"
        }
      }
    */
  // #endregion
  )
  .delete(isAuth ,PostsController.deletePost
    // #region
    /*
      #swagger.tags = ['Posts']
      #swagger.description = '刪除單一貼文資料'
      #swagger.security = [{
        "AuthToken": []
      }]
      #swagger.responses[200] = {
        description: '成功訊息',
        schema: {
          "status": true,
          "message": "刪除成功"
        }
      }
    */
  // #endregion
  )

// 按讚
router.post('/:postId/like', isAuth, PostsController.addLike);

// 取消按讚
router.delete('/:postId/unlike', isAuth, PostsController.deleteLike);

// 新增留言
router.post('/:postId/comment', isAuth, PostsController.addComment);

// 修改及刪除留言
router
  .route('/comment/:commentId')
  .patch(isAuth, PostsController.editComment)
  .delete(isAuth, PostsController.deleteComment);


module.exports = router;
