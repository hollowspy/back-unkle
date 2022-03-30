const { wrap } = require('express-promise-wrap');
const moment = require('moment')
const client = require('../bdd/bdd');


const contractUsersController = {
    
    addContract: wrap(async (req, res, next) => {
        if (req.user.role !== 'admin') {
            const error = new Error('Unauthorized. You have no rights in order to add a contract');
            error.status = 403;
            return next(error);
        }
        const contractUser = { ...req.body};
        const dateEnd = (contractUser.date_end) ? contractUser.date_end.toString() : null;
        const query = `INSERT INTO contract_users (id_contract, id_user , status, date_start, date_end)
        VALUES (${contractUser.id_contract}, ${contractUser.id_user}, '${contractUser.status}', '${contractUser.date_start}',
        ${(dateEnd) ? `'${dateEnd}'` : null })
        RETURNING contract_users.*;`;
        const newContractUser = await client.query(query);
        if (!newContractUser || (newContractUser && newContractUser.rowCount === 0)) {
            const error = new Error('Error in insert Contract User');
            error.status = 400;
            return next(error);
        }
        return res.send(newContractUser.rows[0])
    }),
    
    listContractUsers: wrap(async (req, res, next) => {
        let query = `SELECT * FROM contract_users`;
        if (req.query.id_user) {
            query = `${query} WHERE id_user = ${parseInt(req.query.id_user, 10)}`
        }
        query = `${query} ORDER BY id ASC`;
        const contractUsers = await client.query(query);
        if (req.query.full && req.query.full === 'true') {
            const fullContractUsers = await Promise.all(contractUsers.rows.map(async (c) => {
                const contracts = await client.query(`SELECT * FROM contracts WHERE id = ${c.id_contract}`)
                const options = await client.query(`SELECT * FROM contract_options WHERE id_contract = ${c.id}`);
                const fullOptions = await Promise.all(options.rows.map(async (o) => {
                    const option = await client.query(`SELECT * FROM options WHERE id = ${o.id_option}`);
                    return {
                        ...o,
                        _option: {
                           ...option.rows[0]
                        }
                    }
                }))
                return {
                    ...c,
                    _contract_options: fullOptions,
                    _contract: {
                        ...contracts.rows[0]
                    }
                }
            }))
            return res.send({
                contract_users: fullContractUsers
            })
        }
        return res.send({
            contract_users: contractUsers.rows
        })
    }),
    
    updateContractUser: wrap(async (req, res, next) => {
        const contractBody = { ...req.body }
        if (!req.params.id) {
            const error = new Error('req params is missing');
            error.status = 400;
            return next(error);
        };
        const queryContract = `SELECT * FROM contract_users WHERE id = ${parseInt(req.params.id, 10)}`;
        const contractUser = await client.query(queryContract)
        if (!contractUser || contractUser.rowCount === 0) {
            const error = new Error('Contract user not found');
            error.status = 404;
            return next(error);
        }
        
        if (contractUser.rows[0].date_resiliation) {
            const error = new Error('This contract is already cancelled');
            error.status = 400;
            return next(error);
        }
        
        const queryUser = `SELECT * FROM users WHERE id=${contractUser.rows[0].id_user}`;
        const user = await client.query(queryUser);
        if ((req.user.role !== 'admin') && (user.rows[0].id !== req.user.id)) {
            const error = new Error('Unauthorized. This contract doest not belong to current user with customer role');
            error.status = 403;
            return next(error)
        }
    
        const dateEnd = (contractBody.date_end) ? contractBody.date_end : null;
        const dateResiliation = (contractBody.date_resiliation) ? contractBody.date_resiliation : null;
        const updateContractUser = `UPDATE contract_users
                            SET id_contract = ${contractBody.id_contract},
                            id_user = ${contractBody.id_user},
                            status = '${contractBody.status}',
                            date_start = '${moment(new Date(contractBody.date_start)).format('YYYY-MM-DD')}',
                            date_end = '${(dateEnd) ? `${moment(new Date(dateEnd)).format('YYYY-MM-DD')}`: null}',
                            date_resiliation = '${(dateResiliation) ? `${moment(new Date(dateResiliation)).format('YYYY-MM-DD')}`: null}'
                            WHERE id = ${parseInt(req.params.id, 10)}
                            RETURNING contract_users.*;`
        const contractDelete = await client.query(updateContractUser);
        if (contractDelete.rowCount === 0) {
            const error = new Error('Error on update Contract user');
            error.status = 400;
            return next(error);
        }
        return res.send(updateContractUser.rows[0])
       
    })
};

module.exports = contractUsersController
