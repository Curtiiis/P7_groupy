const db = require('../config/db');

const Post = function(post) {
    this.userId      = post.userId,
    this.description = post.description,
    this.media       = post.media
}

Post.create = (newPost, result) => {
    db.query("INSERT INTO posts SET ?", newPost, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, newPost)
        });
};

module.exports = Post;
   