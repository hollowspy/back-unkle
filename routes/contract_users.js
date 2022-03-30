const express = require('express');
const router = express.Router();

const contractUsersController = require('../controllers/contract_users');

router.post('/', contractUsersController.addContract);
router.get('/', contractUsersController.listContractUsers);
router.put('/:id', contractUsersController.updateContractUser);

module.exports = router;
