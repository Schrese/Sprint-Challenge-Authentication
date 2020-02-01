const request = require('supertest');
const bcrypt = require('bcryptjs');

const server = require('../api/server.js');
const db = require('../database/dbConfig.js');
const {createToken} = require('../auth/auth-router.js');

describe('auth router endpoints', function() {
    beforeEach(async function() {
        await db('users').truncate();
    })

    describe('register endpoint', function() {
        it('tests status code', async function() {
            const user = { username: 'registration', password: 'somethingElse' }

            await db('users').truncate();

            const res = await request(server)
                .post('/api/auth/register').send(user)

            await expect(res.status).toBe(201);
        });

        it('returns new user', async function() {
            const user = { username: 'registration', password: 'somethingElse' }

            const [id] = await db('users').insert(user);

            const newUser = await db('users').where({ id }).first();
            await expect(newUser.username).toBe('registration');
            await expect(newUser.id).toBeDefined();
        })
    })

    describe('login endpoint', function() {
        it('tests status code and JSON Web Token', async function() {
            const user = {username: 'loggingIn', password: 'uhhhhhhh'}

            const hashed = bcrypt.hashSync(user.password, 12);
            user.password = hashed;
            
            await db('users').truncate();
            await db('users').insert(user);

            const res = await request(server)
                .post('/api/auth/login').send({username: 'loggingIn', password: 'uhhhhhhh'})
            
            await expect(res.status).toBe(200);
            await expect(res.body.token).toBeDefined();

        })

        it('tests status 401 for incorrect information', async function() {
            const user = {username: 'loggingIn', password: 'uhhhhhhh'}

            const hashed = bcrypt.hashSync(user.password, 12);
            user.password = hashed;
            
            await db('users').truncate();
            await db('users').insert(user);

            const res = await request(server)
                .post('/api/auth/login').send({username: 'lggingIn', password: 'uhhhhhhh'})
            
            await expect(res.status).toBe(401);

        })
    })
    
    describe('get jokes', function() {
        test('should return 200 status', function() {
            
            return request(server)
            .post('/api/auth/register').send({username: 'maybe', password: 'this works'})

            .then(res => {
                return request(server)
                .post('/api/auth/login').send({username: 'maybe', password: 'this works'})
                
                .then(res => {
                    const token = res.body.token

                    return request(server).get('/api/jokes')
                        .set("Authorization", token)
                    .then(res => {
                        expect(res.status).toBe(200)
                    })
                        
                        })
                })
            })

      

        
    })

    //Below is my original thought process
    // describe('getting jokes', function() {
    //     it('returns jokes', async function() {
    //         const newUser = {username: 'loggingIn', password: 'uhhhhhhh'}
    //         await db('users').truncate();
    //         await db('users').insert(newUser);

    //         const user = await request(server)
    //             .post('/api/auth/login').send({username: 'loggingIn', password: 'uhhhhhhh'})

    //         const res = await request(server)
    //             .get('/api/jokes')
    //             .set('authorization', user.token)
            
    //         await expect(res.status).toBe(200);
    //     })
    // })
})