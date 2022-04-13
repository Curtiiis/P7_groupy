const db = require('../config/db');

const User = function (user) {
    this.email = user.email,
        this.pseudo = user.pseudo,
        this.password = user.password,
        this.isAdmin = false,
        this.isModerator = false,
        this.isActive = true
}

User.create = (newUser, result) => {
    db.query("INSERT INTO users SET ?", newUser, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length === 0) {
            result(null, null);
            return;
        }
        result(null, { newUser })
    });
};

User.getUserByEmail = (email, result) => {
    db.query("SELECT * FROM users WHERE email = ?", email, (err, res) => {
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
