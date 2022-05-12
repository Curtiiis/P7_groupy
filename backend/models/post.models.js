const db = require('../config/db');

const Post = function (post) {
  this.title = post.title;
  this.text = post.text;
  this.media = post.media;
  this.userId = post.userId;
}

Post.create = (data, result) => {
  db.query("INSERT INTO posts SET ?", data, (err, res) => {
    (err) ? result(err, null) : result(null, data)
  });
};

Post.getLastByFive = (data, result) => {
  db.query("SELECT * FROM `posts_users` ORDER BY createdAt DESC LIMIT ?", data, (err, res) => {
    (err) ? result(err, null) : result(null, res)
  });
};

Post.getOneByPostId = (data, result) => {
  db.query("SELECT * FROM `posts_users` WHERE postId = ?", data, (err, res) => {
    (err) ? result(err, null) : result(null, res)
  });
};

// Post.update = (data, result) => {
//   db.query("UPDATE `posts` SET title = ?, text = ?, media = ? WHERE `posts`.`id` = ?", data, (err, res) => {
//     if (err) {
//       result(err, null);
//       return;
//     }
//     result(null, data)
//   });
// };

module.exports = Post;
