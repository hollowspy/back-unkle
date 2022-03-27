const { Client } = require('pg')

console.log('in client');
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'unkle',
    password: 'Jn8bb11',
    port: 5432,
})
client.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = client;
