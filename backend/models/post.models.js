const db = require('../config/db');

const Post = function (post) {
  this.title = post.title;
  this.text = post.text;
  this.media = post.media;
  this.userId = post.userId;
}

// const WholePost = function (item) {
//   this.notMyself = item.notMyself;
//   this.link = item.link;
//   this.updated = item.updated;
//   this.likes = item.likes;
//   this.liked = item.liked;
//   this.saves = item.saves;
//   this.saved = item.saved;
//   this.follows = item.follows;
//   this.followed = item.followed;
//   this.comments = item.comments;
//   this.commentsCount = item.commentsCount;
//   this.commentText = "";
// }
// const wholePost = new WholePost({
//   notMyself : item.userId != userIdAuth,
//   link : item.pseudo.toLowerCase().replace(" ", "-"),
//   updated : Number(item.createdAt) !== Number(item.updatedAt),
//   likes : likesArray.length,
//   liked : likesArray.includes(userIdAuth),
//   saves : item.saves,
//   saved : item.saved,
//   follows : item.follows,
//   followed : item.followed,
//   comments : item.comments,
//   commentsCount : item.commentsCount,
//   commentText : ""
// });

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
