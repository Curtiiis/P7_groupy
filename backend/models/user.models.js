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

User.getAllActives = (result) => {
  db.query("SELECT id AS userId,pseudo,picture,isAdmin,isActive FROM `users` WHERE isActive = 1", (err, res) => {
    (err) ? result(err, null) : result(null, res)
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
    (err || res.length === 0) ? result(err, false) : result(null, res[0]);
  })
};

User.getUsersStats = (data, result) => {
  db.query(`SELECT 
  COUNT(id) AS users,
  SUM (CASE WHEN isActive = 1 THEN 1 ELSE 0 END) AS users_actives, 
  SUM (CASE WHEN isActive = 0 THEN 1 ELSE 0 END) AS users_disabled, 
  SUM (CASE WHEN isAdmin = 1 THEN 1 ELSE 0 END) AS status_admins, 
  SUM (CASE WHEN isAdmin = 0 THEN 1 ELSE 0 END) AS status_users 
  FROM users`, data, (err, res) => {
    (err) ? result(err, null) : result(null, res)
  })
};

module.exports = User;

