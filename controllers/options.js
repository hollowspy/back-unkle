const { wrap } = require('express-promise-wrap');
const client = require('../bdd/bdd');

const optionsController = {
    
    listOptions: wrap(async (req, res, next) => {
        const options = await client.query('SELECT * FROM options');
        return res.send({
            options: options.rows
        })
    }),
    
    
    
    
    
    
    
    
};

module.exports = optionsController
