const express = require('express');
const { isAuth, isAdmin } = require('../utility/auth');
const router = express.Router();
const UsersController = require('../controllers/users');
const asyncError = require('../utility/asyncError');

router
  .route('/')
  .get(isAuth, UsersController.getUsers
    // #region
    /**
      #swagger.tags = ['Users']
      #swagger.description = '取得全部使用者資料'
      #swagger.security = [{
        "AuthToken": []
      }]
      #swagger.responses[200] = {
        description: '成功訊息',
        schema: {
          "status": true,
          "data": [
            {
              "_id": "627b338faf6b9972e353ac19",
              "name": "TESTMAN",
              "avatar": "",
              "likes": [],
              "following": [],
              "comments": [],
              "createdAt": "2022-05-11T03:54:55.516Z"
            }
          ]
        }
      }
    */
    // #endregion
  )
  // .delete(isAuth, UsersController.deleteUsers
  //   // #region
  //   /**
  //     #swagger.tags = ['Users']
  //       #swagger.description = '刪除全部使用者資料'
  //       #swagger.security = [{
  //         "AuthToken": []
  //       }]
  //       #swagger.responses[200] = {
  //         description: '成功訊息',
  //         schema: {
  //           "status": true,
  //           "message": "全部項目刪除成功",
  //           "data": []
  //         }
  //       }
  //   */
  //   // #endregion
  // );


router
  .route('/profile')
  .get(isAuth, UsersController.getUser
    // #region
    /**
    #swagger.tags = ['Users']
      #swagger.description = '取得單一使用者資料'
      #swagger.security = [{
        "AuthToken": []
      }]
      #swagger.responses[200] = {
        description: '成功訊息',
        schema: {
        "status": true,
          "data": [
            {
              "_id": "627b338faf6b9972e353ac19",
              "name": "TESTMAN",
              "avatar": "",
              "likes": [],
              "following": [],
              "comments": [],
              "createdAt": "2022-05-11T03:54:55.516Z"
            }
          ]
        }
      }
    */
    // #endregion
  )
  .patch(isAuth, UsersController.editUser
    // #region
    /**
    #swagger.tags = ['Users']
      #swagger.description = '修改單一使用者資料'
      #swagger.security = [{
        "AuthToken": []
      }]
      #swagger.parameters['body'] = {
        in: 'body',
        description: '資料格式',
        schema: {
          name : "美索不達米亞", 
        }
      }
      #swagger.responses[200] = {
        description: '成功訊息',
        schema: {
          "status": true,
          "message": "更新成功"
        }
      }
    */
    // #endregion
  );

// 取得按讚列表
router.get('/getLikeList', isAuth, UsersController.getLikeList);


router.patch('/updatePassword', isAuth, UsersController.updatePassword);

router.post('/sign_up', UsersController.addUser
  // #region
    /**
      #swagger.tags = ['Users']
      #swagger.description = '取得全部使用者資料'
      #swagger.security = [{
        "AuthToken": []
      }]
      #swagger.responses[200] = {
        description: '成功訊息',
        schema: {
          "status": true,
          "data": [
            {
              "_id": "627b338faf6b9972e353ac19",
              "name": "TESTMAN",
              "avatar": "",
              "likes": [],
              "following": [],
              "comments": [],
              "createdAt": "2022-05-11T03:54:55.516Z"
            }
          ]
        }
      }
    */
    // #endregion
);

router.post('/sign_in', UsersController.signIn);

// 取得個人追蹤名單
router.get('/following', isAuth, UsersController.getFollowings)

router
  .route('/:userId')
  .delete(isAuth, isAdmin, UsersController.deleteUser
    // #region
    /**
    #swagger.tags = ['Users']
      #swagger.description = '刪除單一使用者資料'
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
  );

// 加入追蹤
router.post('/:userId/follow', isAuth, UsersController.addFollowing)

// 取消追蹤
router.delete('/:userId/unfollow', isAuth, UsersController.deleteFollowing)


module.exports = router;
