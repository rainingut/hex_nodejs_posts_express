const express = require('express');
const router = express.Router();
const { isAuth, isAdmin } = require('../utility/auth');
const uploadController  = require('../controllers/upload');
const uploadMulter = require('../utility/upload');

router.post('/', isAuth, 
  uploadMulter.uploadImage,
  uploadController.uploadImage
);

module.exports = router;