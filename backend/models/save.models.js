const db = require('../config/db');

const Save = function (post) {
  this.userId = post.userId,
    this.postId = post.postId
}

Save.create = (newSave, result) => {
  db.query("INSERT INTO saves SET ?", newSave, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, newSave)
  });
};

Save.getAllSaves = (result) => {
  db.query("SELECT postId, userId FROM `saves`", (err, res) => {
    if (err) { return result(err, null) };
    if (res.length === 0) { return result(null, null) };
    return result(null, res)
  })
};

Save.getOneByPostId = (data, result) => {
  db.query("SELECT userId FROM `saves` WHERE postId = ?", data, (err, res) => {
    (err) ? result(err, null) : result(null, res)
  });
};

module.exports = Save;
