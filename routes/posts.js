const express = require('express');
const router = express.Router();
const PostsControllers = require('../controllers/posts');
const asyncError = require('../utility/asyncError');

router.get('/', asyncError(PostsControllers.getPosts));
router.post('/', asyncError(PostsControllers.postPost));
router.delete('/', asyncError(PostsControllers.deletePosts));
router.get('/:postId', asyncError(PostsControllers.getPost));
router.patch('/:postId', asyncError(PostsControllers.patchPost));
router.delete('/:postId', asyncError(PostsControllers.deletePost));

module.exports = router;
