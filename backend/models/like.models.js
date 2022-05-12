const db = require('../config/db');

const Like = function (post) {
  this.userId = post.userId,
    this.postId = post.postId
}

Like.create = (newLike, result) => {
  db.query("INSERT INTO likes SET ?", newLike, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, newLike)
  });
};

Like.getAllLikes = (result) => {
  db.query("SELECT postId,userId FROM `likes`", (err, res) => {
    (err) ? result(err, null) : result(null, res)
  })
};

Like.getOneByPostId = (data, result) => {
  db.query("SELECT userId FROM `likes` WHERE postId = ?", data, (err, res) => {
    (err) ? result(err, null) : result(null, res)
  });
};

module.exports = Like;
