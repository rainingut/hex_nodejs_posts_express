var express = require('express');
var router = express.Router();
const PostsControllers = require('../controllers/posts');

router.get('/', PostsControllers.getPosts);
router.post('/', PostsControllers.postPost);
router.delete('/', PostsControllers.deletePosts);
router.patch('/:postId', PostsControllers.patchPost);
router.delete('/:postId', PostsControllers.deletePost);

module.exports = router;
