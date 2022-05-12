const db = require('../config/db');

const Report = function (post) {
  this.postId = post.postId;
  this.userId = post.userId;
}

Report.create = (data, result) => {
  db.query("INSERT INTO `reports` SET ?", data, (err, res) => {
    (err) ? result(err, null) : result(null, res)
  });
};

Report.getByPostIdAndUserId = (data, result) => {
  db.query("SELECT userId FROM `reports` WHERE postId = ? AND userId = ?", data, (err, res) => {
    (err) ? result(err, null) : result(null, res)
  });
};

module.exports = Report;
