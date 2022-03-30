const { wrap } = require('express-promise-wrap');
const bcrypt = require('bcrypt');
const client = require('../bdd/bdd');

const usersController = {
    
    listUsers: wrap(async (req, res, next) => {
        const users = await client.query('SELECT * FROM users');
        return res.send({
           users: users.rows
        })
    }),
    
    
    createUser: wrap(async (req, res, next) => {
        if (req.user.role !== 'admin') {
            const error = new Error('Unauthorized. You have no rights in order to add a a new user');
            error.status = 403;
            return next(error);
        }
        const user = {...req.body};
        const passwordHash = bcrypt.hashSync(user.password, 10);
        const query = `INSERT INTO USERS (email, password , role) VALUES ('${user.email}', '${passwordHash}', '${user.role}')`;
        const insertUser = await client.query(query);
        if (!insertUser) {
            const error = new Error('Error in insert User');
            error.status = 400;
            return next(error);
        }
        return res.send({
            success: true
        });
    }),
    
    getUser: wrap(async (req, res, next) => {
        if (!req.params.id) {
            const error = new Error('req params is missing');
            error.status = 400;
            return next(error)
        }
        const idUserRequested = parseInt(req.params.id, 10);
        const query = `SELECT * FROM users WHERE id = ${idUserRequested}`
        const user = await client.query(query);
        if (user.rowCount === 0) {
            const error = new Error('User not found');
            error.status = 404;
            return next(error)
        }
        return res.send(user.rows[0])
    }),
    
    deleteUser: wrap(async (req, res, next) => {
        if (!req.params.id) {
            const error = new Error('req params is missing');
            error.status = 400;
            return next(error)
        }
        if (req.user.role !== 'admin') {
            const error = new Error('Unauthorized. You have no right to delete some users');
            error.status = 403;
            return next(error)
        }
        const idUserRequested = parseInt(req.params.id, 10);
        if (req.user.id === idUserRequested) {
            const error = new Error('You can not delete your own user');
            error.status = 400;
            return next(error);
        }
        const query = `DELETE FROM users WHERE id = ${idUserRequested}`
        const deleteUser = await client.query(query);
        return res.send({
            success: (deleteUser.rowCount > 0)
        })
    })
    
};

module.exports = usersController
