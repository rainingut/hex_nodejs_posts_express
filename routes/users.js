const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');
const  asyncError = require('../utility/asyncError');

router.get('/', asyncError(UsersController.getUsers)
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
router.post('/', asyncError(UsersController.addUser)
  // #region
  /**
  #swagger.tags = ['Users']
    #swagger.description = '新增單一使用者資料'
    #swagger.security = [{
      "AuthToken": []
    }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: '資料格式',
      schema: {
        $name:"TESTMAN",
        $email:"testman@mail.com",
        $password:"123456",
        $confirmPsw:"123456",
        sex: 'male',
        avator: 'https://pngimg.com/uploads/telegram/telegram_PNG36.png',
      }
    }
    #swagger.responses[200] = {
      description: '成功回傳資訊',
      schema: {
        "status": true,
        "message": "新增成功",
        "data": {
          "name": "TESTMAN",
          "email": "testman@mail.com",
          "password": "123456",
          "avatar": "",
          "likes": [],
          "following": [],
          "_id": "627b388a76cb9f85554f2340",
          "comments": [],
          "createdAt": "2022-05-11T04:16:10.309Z"
        }
      }
    }
  */
  // #endregion
);
router.delete('/', asyncError(UsersController.deleteUsers)
  // #region
  /**
    #swagger.tags = ['Users']
      #swagger.description = '刪除全部使用者資料'
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
router.get('/:userId', asyncError(UsersController.getUser)
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
);
router.patch('/:userId', asyncError(UsersController.editUser)
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
router.delete('/:userId', asyncError(UsersController.deleteUser)
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

module.exports = router;
