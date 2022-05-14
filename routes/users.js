const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');
const  asyncError = require('../utility/asyncError');

router.get('/', asyncError(UsersController.getUsers));
router.post('/', asyncError(UsersController.addUser));
router.delete('/', asyncError(UsersController.deleteUsers));
router.get('/:userId', asyncError(UsersController.getUser));
router.patch('/:userId', asyncError(UsersController.editUser));
router.delete('/:userId', asyncError(UsersController.deleteUser));

module.exports = router;
