const router = require('express').Router();
const bcrypt = require('bcryptjs');
const token = require('jsonwebtoken');


const Users = require('../users/users-model.js');

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // sign in token
        const token = signToken(user);
        //send the token
        res.status(200).json({
          token,
          message: `Welcome ${user.username}!`,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: "you f*cked up" });
    });
});

function signToken(user) {
  const payload = {
    // header payload and verify signature
    // payload -> username, id, roles, exp date
    username: user.username,
    subject: user.id,
    role: user.role,
  }
  const secret = process.env.SECRET || "this is my secret, i sleep eyes wide open.";
  const options = {
    expiresIn: '1h',
  };
  return token.sign(payload, secret, options)
}

module.exports = router;
