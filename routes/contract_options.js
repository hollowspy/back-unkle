const express = require('express');
const router = express.Router();

const contractOptionsController = require('../controllers/contract_options');

router.post('/', contractOptionsController.addContractOption);


module.exports = router;
