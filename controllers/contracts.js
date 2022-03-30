const { wrap } = require('express-promise-wrap');
const client = require('../bdd/bdd');

const contractController = {
    
    listContracts: wrap(async (req, res, next) => {
        const contracts = await client.query('SELECT * FROM contracts');
        return res.send({
            contracts: contracts.rows
        })
    }),
    
    
    
    
    
    
    
    
};

module.exports = contractController
