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

Report.getAll = (result) => {
  db.query("SELECT postId, userId FROM `saves` ORDER BY createdAt DESC", (err, res) => {
    if (err) { return result(err, null) };
    if (res.length === 0) { return result(null, null) };
    return result(null, res)
  })
};

Report.getByPostIdAndUserId = (data, result) => {
  db.query("SELECT userId FROM `reports` WHERE postId = ? AND userId = ?", data, (err, res) => {
    (err) ? result(err, null) : result(null, res)
  });
};

module.exports = Report;
