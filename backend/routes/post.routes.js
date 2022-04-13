const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post.controllers');

//CRUD Post and comments
router.get('/', postCtrl.getPosts);
router.get('/comments', postCtrl.getAllComments);
router.get('/:id', postCtrl.getPost);
router.get('/:id/comments', postCtrl.getPostComments);
router.get('/:id/comments/:number', postCtrl.getPostComment);
router.get('/addpost', postCtrl.addPost);
router.get('/createpoststable', postCtrl.addPost);

router.post('/', postCtrl.createPost);
router.post('/:id/comments', postCtrl.postComment);

router.put('/:id', postCtrl.putPost);
router.put('/:id/comments/:number', postCtrl.putComment);

router.delete('/:id', postCtrl.deletePost);
router.delete('/:id/comments/:number', postCtrl.deleteComment);

// router.get('/comments', postCtrl.getAllComments);


module.exports = router;