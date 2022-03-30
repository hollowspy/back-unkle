const { wrap } = require('express-promise-wrap');
const client = require('../bdd/bdd');

const contractOptionsController = {
    
    addContractOption: wrap(async (req, res, next) => {
        console.log('req body', req.body);
        if (req.user.role !== 'admin') {
            const error = new Error('Unauthorized. You have no rights in order to add a contract option');
            error.status = 403;
            return next(error);
        }
        const query = `INSERT INTO contract_options (id_contract, id_option)
        VALUES (${req.body.id_contract}, ${req.body.id_option})
        RETURNING contract_options.*;`
        const newContractOption = await client.query(query)
        if (!newContractOption || (newContractOption && newContractOption.rowCount === 0)) {
            const error = new Error('Error in insert Contract Option');
            error.status = 400;
            return next(error);
        }
        return res.send(newContractOption.rows[0])
    }),

};

module.exports = contractOptionsController
