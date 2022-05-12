const db = require('../config/db');

const Follow = function (post) {
  this.userId = post.userId,
    this.followId = post.followId
}

Follow.create = (newFollow, result) => {
  db.query("INSERT INTO follows SET ?", newFollow, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, newFollow)
  });
};

Follow.getAllFollows = (result) => {
  db.query("SELECT userId, followId FROM `follows`", (err, res) => {
    if (err) { return result(err, null) };
    if (res.length === 0) { return result(null, null) };
    return result(null, res)
  })
};

Follow.getFollowsFromUser = (data, result) => {
  db.query("SELECT userId, followId FROM `follows` WHERE followId = ?", data, (err, res) => {
    if (err) { return result(err, null) };
    if (res.length === 0) { return result(null, null) };
    return result(null, res)
  })
};

module.exports = Follow;
