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
  let {username, password} = req.body;

  Users.findBy({ username })
    .then(dad => {
      if (dad && bcrypt.compareSync(password, dad.password)) {
        const token = createToken(dad);
        res.status(200).json({ message: `Welcome ${dad.username}, feel free to joke about the cabin!`, token })
      } else {
        res.status(401).json({ message: 'Please provide valid credentials' })
      }
    })
    .catch(err => {
      console.log('error loggin in this user', err);
      res.status(500).json({ errorMessage: 'Could not log in' })
    })

});

function createToken(user) {
  const payload = {
    userId: user.id,
    username: user.username
  }
  const options = {
    expiresIn: '2h'
  }
  return jwt.sign(payload, secrets.jwtSecret, options);
} 


module.exports = router;
