const express = require('express');
const router = express.Router();

const optionsController = require('../controllers/options');

router.get('/', optionsController.listOptions);


module.exports = router;
