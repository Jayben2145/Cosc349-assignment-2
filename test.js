const bcrypt = require('bcrypt');

const password = 'burlywood995'; // Replace with your admin password

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log('Hashed Password:', hash);
});
