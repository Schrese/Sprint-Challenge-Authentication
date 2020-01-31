const db = require('../database/dbConfig.js');

const { add } = require('../jokes/jokes-model.js');

describe('authentications', () => {
    

    describe('adds a new user', function() {
        beforeEach(async function(){
            await db('users').truncate();
        })

        it('adds a new user', async function() {
            await add({username: 'testUser', password: 'testPass'});
            await add({username: 'testAnotherUser', password: 'testAnotherPass'});

            const users = await db('users');

            expect(users).toHaveLength(2);
            expect(users[0].username).toBe('testUser');
            expect(users[1].username).toBe('testAnotherUser');
        })
    })

})