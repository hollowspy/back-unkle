const express = require('express');
const router = express.Router();

const contractsController = require('../controllers/contracts');

router.get('/', contractsController.listContracts);


module.exports = router;
