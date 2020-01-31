const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../jokes/jokes-model.js');
const secrets = require('../configs/shhhhh.js');

router.post('/register', (req, res) => {
  // implement registration
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;

  Users.add(user)
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(err => {
      console.log('error creating a new user', err);
      res.status(500).json({ errorMessage: 'Error creating this user' });
    })

});

router.post('/login', (req, res) => {
  // implement login
});

module.exports = router;
