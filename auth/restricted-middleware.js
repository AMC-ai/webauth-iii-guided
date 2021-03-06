const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('./secret');

const Users = require('../users/users-model.js');


module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token, req.headers);
  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        console.log('failed verify', err);
        res.status(401).json({ message: 'not verified' });
      } else {
        // token is valid
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    res.status(400).json({ message: 'no token provided' });
  }
};


// module.exports = (req, res, next) => {
//   const { username, password } = req.headers;

//   if (username && password) {
//     Users.findBy({ username })
//       .first()
//       .then(user => {
//         if (user && bcrypt.compareSync(password, user.password)) {
//           next();
//         } else {
//           res.status(401).json({ message: 'Invalid Credentials' });
//         }
//       })
//       .catch(error => {
//         res.status(500).json({ message: 'Ran into an unexpected error' });
//       });
//   } else {
//     res.status(400).json({ message: 'No credentials provided' });
//   }
// };
