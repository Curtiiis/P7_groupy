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
    "SELECT SUM (CASE WHEN pseudo = ? THEN 1 ELSE 0 END) AS pseudo, SUM (CASE WHEN email = ? THEN 1 ELSE 0 END) AS email FROM users", data, (err, res) => {
      (err || res[0].pseudo !== 0 || res[0].email !== 0)
        ? result(err, false)
        : result(null, true)
    })
};

User.getUserByEmail = (email, result) => {
  db.query("SELECT id AS userId,password,email,isAdmin,isActive FROM `users` WHERE email = ?", email, (err, res) => {
    if (err) { return result(err, null) };
    if (res.length === 0) { return result(null, null) };
    if (res[0].isActive == 0) { return result(null, res[0].isActive) };
    return result(null, res[0])
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

