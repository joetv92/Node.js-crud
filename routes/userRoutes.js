const express = require('express');
const router = express.Router();
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');

// المسارات
router.post('/', createUser);           // CREATE
router.get('/', getAllUsers);           // READ ALL
router.get('/:id', getUserById);       // READ ONE
router.put('/:id', updateUser);        // UPDATE
router.delete('/:id', deleteUser);     // DELETE

module.exports = router;