const express = require('express');
const jwt = require('jsonwebtoken');
const client = require('../bdd/bdd');

const app = express();
const {wrap} = require('express-promise-wrap');


app.use('*', wrap(async (req, res, next) => {
    if (req.originalUrl === '/login') {
        return next();
    }
    if (!req.headers.authorization) {
        const error = new Error('token is missing');
        error.status = 400;
        return next(error);
    }
    const token = req.headers.authorization.split(' ')[1];
    const tokenDecoded = jwt.verify(token, 'secretKey');
    if (!tokenDecoded) {
        const error = new Error('token Invalid');
        error.status = 400;
        return next(error);
    }
    const currentUser = await client.query(`SELECT * FROM users WHERE email = '${tokenDecoded.userEmail}'`);
    if (currentUser.rowCount === 0) {
        const error = new Error('user not found');
        error.status = 404;
        return next(error);
    }
    req.user = currentUser.rows[0];
    return next();
}))


module.exports = app
