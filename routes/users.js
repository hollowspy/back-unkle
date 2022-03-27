const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');

router.get('/', userController.listUsers);
router.get('/:id', userController.getUser);
router.post('/', userController.createUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
