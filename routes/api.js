const express = require('express');

const router = express.Router();

const usersRouter = require('./users');
const loginRouter = require('./login');

router.use('/users', usersRouter);
router.use('/login', loginRouter);


module.exports = router;
