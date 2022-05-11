const db = require('../config/db');

const User = function (user) {
  this.pseudo = user.pseudo;
  this.email = user.email;
  this.password = user.password;
};

User.create = (data, result) => {
  db.query("INSERT INTO `users` SET ?", data, (err, res) => {
    (err) ? result(err, null) : result(null, data)
  })
};

User.isUnique = (data, result) => {
  db.query(
    "SELECT SUM (CASE WHEN pseudo = ? THEN 1 ELSE 0 END) AS samePseudo, SUM (CASE WHEN email = ? THEN 1 ELSE 0 END) AS sameEmail FROM users", data, (err, res) => {
      (err || res[0].samePseudo !== 0 || res[0].sameEmail !== 0) ? result(err, false) : result(null, true)
    })
};

User.getUserByEmail = (email, result) => {
  db.query("SELECT id,pseudo,password,picture,email,isAdmin,isActive FROM users WHERE email = ?", email, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length === 0) {
      result(null, null);
      return;
    }
    result(null, res[0])
  })
};

User.getUserById = (userId, result) => {
  db.query("SELECT id, picture, pseudo FROM users WHERE id = ?", userId, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length === 0) {
      result(null, null);
      return;
    }
    result(null, res[0])
  })
};

module.exports = User;

