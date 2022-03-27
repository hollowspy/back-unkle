const { wrap } = require('express-promise-wrap');
const bcrypt = require('bcrypt');
const client = require('../bdd/bdd');
const jwt = require('jsonwebtoken');

const usersController = {
    
    login: wrap(async (req, res, next) => {
        const query = `SELECT * FROM users WHERE email = '${req.body.email}'`;
        const user = await client.query(query);
        if (user.rowCount === 0) {
            const error = new Error('User not found');
            error.status = 404;
            return next(error);
        }
        const isSamePassword = bcrypt.compareSync(req.body.password, user.rows[0].password);
        if (!isSamePassword) {
            const error = new Error('Wrong password');
            error.status = 400;
            return next(error);
        }
        const token = jwt.sign({
            userEmail: user.rows[0].email
        }, 'secretKey')
        return res.send({
            access_token: token,
            user: user.rows[0]
        });
    })
    
};

module.exports = usersController
