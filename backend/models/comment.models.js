const db = require('../config/db');

const Comment = function (post) {
  this.userId = post.userId;
  this.postId = post.postId;
  this.text = post.text;
}

Comment.create = (data, result) => {
  db.query("INSERT INTO `comments` SET ?", data, (err, res) => {
    (err) ? result(err, null) : result(null, data)
  })
};

Comment.getByPostId = (data, result) => {
  db.query("SELECT * FROM `comments_pseudo` WHERE postId = ? ORDER BY createdAt DESC", data, (err, res) => {
    (err) ? result(err, null) : result(null, res)
  })
};

Comment.getByIdAndUserId = (data, result) => {
  db.query("SELECT userId FROM `comments` WHERE `comments`.`id` = ? AND `comments`.`userId` = ?", data, (err, res) => {
    (err) ? result(err, null) : result(null, res)
  })
};

Comment.delete = (data, result) => {
  db.query("DELETE FROM `comments` WHERE `comments`.`id` = ?", data, (err, res) => {
    (err) ? result(err, null) : result(null, res)
  })
};

module.exports = Comment;
