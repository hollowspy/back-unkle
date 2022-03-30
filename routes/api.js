const express = require('express');

const router = express.Router();

const usersRouter = require('./users');
const loginRouter = require('./login');
const contractsRouter = require('./contracts');
const optionsRouter = require('./options');
const contractUsersRouter = require('./contract_users');
const contractOptionsRouter = require('./contract_options');

router.use('/users', usersRouter);
router.use('/login', loginRouter);
router.use('/contracts', contractsRouter);
router.use('/options', optionsRouter);
router.use('/contract_users', contractUsersRouter);
router.use('/contract_options', contractOptionsRouter);


module.exports = router;
