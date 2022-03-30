const moment = require('moment')
const client = require('../bdd/bdd');
moment.locale('fr');


const updateStatusContract = async () => {
    console.log('Starting Script....');
    const contractUsers = await client.query(`SELECT * FROM contract_users ORDER BY id ASC`);

    for (const contract of contractUsers.rows) {
        const today = moment(new Date(), "YYYY MM DD")
        const dateStart = moment(new Date(contract.date_start), "YYYY MM DD");
        const dateEnd = (contract.date_end)
            ? moment(new Date(contract.date_end), "YYYY MM DD")
            : null
        let newStatus;
        if (dateStart.isAfter(today)) {
            newStatus = 'pending'
        } else if (dateEnd && dateEnd.isBefore(today)) {
            newStatus = 'finished'
        } else {
            newStatus = 'active'
        }
        if (newStatus !== contract.status) {
            await client.query(`UPDATE contract_users SET status = '${newStatus}' WHERE id = ${contract.id}`);
        }
    }
    console.log('End of daily Script....');
}




module.exports = {
    updateStatusContract
};
