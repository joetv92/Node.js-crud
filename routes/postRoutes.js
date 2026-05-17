const express = require('express');
const router = express.Router();
const {
    createPost,
    getAllPosts,
    getPostById,
    getPostsByUser,
    updatePost,
    deletePost
} = require('../controllers/postController');

// المسارات
router.post('/', createPost);                    // CREATE
router.get('/', getAllPosts);                    // READ ALL
router.get('/user/:user_id', getPostsByUser);   // READ BY USER
router.get('/:id', getPostById);                // READ ONE
router.put('/:id', updatePost);                 // UPDATE
router.delete('/:id', deletePost);              // DELETE

module.exports = router;