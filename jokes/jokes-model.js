const db = require('../database/dbConfig.js');

module.exports = {
    add,
    findById
}

function add(user) {
    return db('user').insert(user, 'id')
    .then(ids => {
        const [id] = ids;
        return findById(id);
    })
}

function findById(id) {
    return db('user').select('id', 'username').where({ id })
}