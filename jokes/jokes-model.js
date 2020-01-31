const db = require('../database/dbConfig.js');

module.exports = {
    add,
    findById
}

function add(user) {
    return db('users').insert(user, 'id')
    .then(ids => {
        const [id] = ids;
        return findById(id).first();
    })
}

function findById(id) {
    return db('users').select('id', 'username').where({ id });
}