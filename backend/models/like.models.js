const db = require('../config/db');

const Like = function (post) {
  this.userId = post.userId;
  this.postId = post.postId;
}

Like.create = (data, result) => {
  db.query("INSERT INTO likes SET ?", data, (err, res) => {
    (err) ? result(err, null) : result(null, res)
  })
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

Like.getCount = (data, result) => {
  db.query("SELECT COUNT(id) AS likes FROM likes", data, (err, res) => {
    (err) ? result(err, null) : result(null, res)
  })
};

module.exports = Like;
