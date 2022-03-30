const { Client } = require('pg')

console.log('in client');
// const client = new Client({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'unkle',
//     password: 'Jn8bb11',
//     port: 5432,
// })
const client = new Client({
    user: 'gdfswmdi',
    host: 'manny.db.elephantsql.com',
    database: 'gdfswmdi',
    password: '3x_TfcmIRBvJkqnh0QHc_S_U4BoNabw_',
    port: 5432,
})
client.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = client;
