const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');

router.get('/', UsersController.getUsers);
router.post('/', UsersController.addUser);
router.delete('/', UsersController.deleteUsers);
router.get('/:userId', UsersController.getUser);
router.patch('/:userId', UsersController.editUser);
router.delete('/:userId', UsersController.deleteUser);

module.exports = router;
