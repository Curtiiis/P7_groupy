require('dotenv').config();
const db = require('../config/db');
const fs = require('fs');
const Post = require('../models/post.models');
const User = require('../models/user.models');
const Like = require('../models/like.models');
const Save = require('../models/save.models');
const Report = require('../models/report.models');
const Follow = require('../models/follow.models');
const Comment = require('../models/comment.models');

// CRUD POSTS
exports.createPost = (req, res, next) => {
  if (!req.file && req.body.title == '' && req.body.text == '') {
    return res.status(400).json({ message: 'Empty body !' })
  }

  if (req.file) {
    const post = new Post({
      userId: req.auth.userId,
      title: req.body.title,
      text: req.body.text,
      media: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    Post.create(post, (err, data) => {
      if (err) throw err
      return res.status(201).json({ message: 'Post created !' });
    })
  } else {
    const post = new Post({
      userId: req.auth.userId,
      title: req.body.title,
      text: req.body.text
    });
    Post.create(post, (err, data) => {
      if (err) throw err
      return res.status(201).json({ message: 'Post created !' });
    })
  }
};

exports.getAllPosts = (req, res, next) => {

  Post.getLastByFive(Number([req.params.number]), (err, dataArray) => {
    const userIdAuth = req.auth.userId;
    if (err) throw err
    Like.getAllLikes((err, dataLikes) => {
      if (err) throw err
      Save.getAllSaves((err, dataSaves) => {
        if (err) throw err
        Follow.getAllFollows((err, dataFollows) => {
          if (err) throw err
          Comment.getAllComments((err, dataComments) => {
            if (err) throw err

            for (let item of dataArray) {
              item.notMyself = item.userId != userIdAuth;
              item.link = item.pseudo.toLowerCase().replace(" ", "-");
              item.updated = Number(item.createdAt) !== Number(item.updatedAt);
              item.likes = dataLikes.filter(x => x.postId == item.postId).map(y => y.userId).length;
              item.liked = dataLikes.filter(x => x.postId == item.postId).map(y => y.userId).includes(userIdAuth);
              item.saves = dataSaves.filter(x => x.postId == item.postId).map(y => y.userId).length;
              item.saved = dataSaves.filter(x => x.postId == item.postId).map(y => y.userId).includes(userIdAuth);
              item.follows = dataFollows.filter(x => x.followId == item.userId).map(y => y.userId);
              item.followed = dataFollows.filter(x => x.followId == item.userId).map(y => y.userId).includes(userIdAuth);
              let commentsArray = dataComments.filter(x => x.postId == item.postId);
              item.comments = commentsArray;
              item.commentsCount = commentsArray.length;
              item.commentText = "";
              for (let comment of commentsArray) {
                comment.updating = false;
                comment.updated = Number(comment.createdAt) !== Number(comment.updatedAt)
              }
            }
            res.status(200).json(dataArray)
          })
        })
      })
    })
  })
};

exports.getOnePost = (req, res) => {
  const userIdAuth = req.auth.userId;
  let values = req.params.id;

  Post.getOneByPostId(values, (err, dataArray) => {
    if (err) throw err
    Like.getOneByPostId(values, (err, dataLikes) => {
      if (err) throw err
      Save.getOneByPostId(values, (err, dataSaves) => {
        if (err) throw err
        Follow.getFollowsFromUser(userIdAuth, (err, dataFollows) => {
          if (err) throw err
          Comment.getByPostId(values, (err, dataComments) => {
            if (err) throw err

            for (let item of dataArray) {
              item.notMyself = dataArray[0].userId != userIdAuth;
              item.likes = dataLikes.length;
              item.liked = dataLikes.map(x => x.userId).includes(userIdAuth);
              item.saves = dataSaves.length;
              item.saved = dataSaves.map(x => x.userId).includes(userIdAuth);
              item.follows = dataFollows;
              item.followed = dataFollows.map(x => x.userId).includes(userIdAuth);
              item.comments = dataComments;
              item.commentsCount = dataComments.length;
              item.commentText = "";
              for (let comment of dataComments) {
                comment.updating = false;
                comment.updated = Number(comment.createdAt) !== Number(comment.updatedAt)
              }
            }
            res.status(200).json(dataArray)
          })
        })
      })
    })
  })
};

exports.modifyPost = (req, res, next) => {
  Post.getByIdAndUserId([req.params.id, req.auth.userId],
    (err, data) => {
      if (err) {
        return res.status(400).json({ message: 'Bad request !' });
      }
      if (data == '' && req.auth.isAdmin == 0) {
        return res.status(401).json({ message: 'Unauthorized request !' })
      }
      Post.modify([req.body.title, req.body.text, req.params.id], (err, response) => {
        if (err) throw err;
        res.status(200).json(response)
      })
    })
};

exports.deletePost = (req, res, next) => {
  Post.getByIdAndUserId([req.params.id, req.auth.userId], (err, data) => {
    if (err) {
      return res.status(400).json({ message: 'Error in request !' });
    }
    if (data == '' && req.auth.isAdmin == 0) {
      return res.status(401).json({ message: 'Unauthorized request !' })
    }
    if (data[0].media != null) {
      const filename = data[0].media.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`);
    }
    Post.delete([req.params.id], (err, data) => {
      if (err) throw err
      res.status(200).json({ message: 'Post deleted !' });
    })
  })
};

exports.getStatistics = (req, res, next) => {
  if (req.auth.isAdmin != 1) {
    return res.status(403).json({ message: 'Unauthorized request !' });
  }
  User.getUsersStats((err, statsUsers) => {
    if (err) throw err
    Post.getCount((err, statsPosts) => {
      if (err) throw err
      Comment.getCount((err, statsComments) => {
        if (err) throw err
        Like.getCount((err, statsLikes) => {
          if (err) throw err
          Object.assign(statsPosts[0], statsUsers[0], statsComments[0], statsLikes[0])
          res.status(200).json(statsPosts[0])
        })
      })
    })
  })
};


// CRUD SAVES
exports.getSaves = (req, res, next) => {
  Save.getFromUser([req.auth.userId], (err, data) => {
    (err)
      ? res.status(400).json({ message: 'Bad request !' })
      : res.status(200).json(data)
  })
}

exports.savePost = (req, res, next) => {
  let values = [req.params.id, req.auth.userId];
  const saveInfo = new Save({
    userId: req.auth.userId,
    postId: req.params.id
  });

  Save.getByPostIdAndUserId(values, (err, data) => {
    if (err) throw err
    let hasBeenSaved = Object.keys(data).length > 0
    if (hasBeenSaved) {
      Save.delete(values, (err, data) => {
        (err)
          ? res.status(400).json({ message: 'Bad request !' })
          : res.status(200).json({ data, message: 'Post unsaved !' });
      })
    } else {
      Save.create(saveInfo, (err, data) => {
        (err)
          ? res.status(400).json({ message: 'Bad request !' })
          : res.status(201).json({ data, message: 'Post saved !' });
      });
    }
  })
};

// CRUD REPORTS
exports.getReports = (req, res, next) => {
  if (req.auth.isAdmin != 1) {
    return res.status(403).json({ message: 'Unauthorized request !' });
  }
  Report.getAll((err, data) => {
    (err)
      ? res.status(400).json({ message: 'Bad request !' })
      : res.status(200).json(data);
  })
}

exports.reportPost = (req, res, next) => {
  const report = new Report({
    postId: req.params.id,
    userId: req.body.owner
  });
  Report.getByPostIdAndUserId([req.params.id, req.body.owner],
    (err, data) => {
      if (err) throw err
      let hasBeenReported = Object.keys(data).length > 0
      if (hasBeenReported) {
        return res.status(201).json({ message: 'Post reported !' });
      }
      Report.create(report, (err, data) => {
        if (err) throw err
        return res.status(201).json({ message: 'Post reported !' });
      });
    })
};

exports.deleteReport = (req, res, next) => {
  if (req.auth.isAdmin != 1) {
    return res.status(403).json({ message: 'Unauthorized request !' });
  }
  db.query(
    "DELETE FROM `reports` WHERE postId = ?",
    [req.params.id],
    (err, data) => {
      if (err) throw err
      res.status(200).json({ message: 'Report deleted !' });
    })
};

//LIKES
exports.likePost = (req, res, next) => {
  let sql = "SELECT userId FROM `likes` WHERE postId = ? AND userId = ?";
  let values = [req.params.id, req.auth.userId]
  db.query(
    sql,
    values,
    (err, data) => {
      if (err) throw err
      let hasBeenLiked = Object.keys(data).length > 0
      if (hasBeenLiked) {
        db.query(
          "DELETE FROM `likes` WHERE postId = ? AND userId = ?",
          values,
          (err, data) => {
            if (err) throw err
            res.status(200).json({ data, message: 'Post unliked !' });
          })
      } else {
        const likeInfo = new Like({
          userId: req.auth.userId,
          postId: req.params.id
        });
        Like.create(likeInfo, (err, data) => {
          if (err) throw err
          res.status(201).json({ data, message: 'Post liked !' });
        });
      }
    })
};

// exports.getOnePost = (req, res) => {
//   const userIdAuth = req.auth.userId;
//   let values = req.params.id;

//   db.query("SELECT * FROM `posts_users` WHERE postId = ?", values, (err, data) => {
//     if (err) throw err
//     db.query("SELECT userId FROM `likes` WHERE postId = ?", values, (err, dataLikes) => {
//       if (err) throw err
//       db.query("SELECT userId FROM `saves` WHERE postId = ?", values, (err, dataSaves) => {
//         if (err) throw err
//         db.query("SELECT userId, followId FROM `follows` WHERE followId = ?", userIdAuth, (err, dataFollows) => {
//           if (err) throw err
//           db.query("SELECT * FROM `comments_pseudo` WHERE postId = ? ORDER BY createdAt DESC", values,
//             (err, dataComments) => {
//               if (err) throw err
//               for (let comment of dataComments) {
//                 comment.updating = false;
//                 comment.updated = Number(comment.createdAt) !== Number(comment.updatedAt)
//               }

//               let onePost = {
//                 ...data[0],
//                 link: data[0].pseudo.toLowerCase().replace(" ", "-"),
//                 updated: Number(data[0].createdAt) !== Number(data[0].updatedAt),
//                 likes: dataLikes.length,
//                 liked: dataLikes.map(x => x.userId).includes(userIdAuth),
//                 saves: dataSaves.length,
//                 saved: dataSaves.map(x => x.userId).includes(userIdAuth),
//                 follows: dataFollows,
//                 followed: dataFollows.map(x => x.userId).includes(userIdAuth),
//                 notMyself: data[0].userId != userIdAuth,
//                 comments: dataComments,
//                 commentsCount: dataComments.length,
//                 commentText: ""
//               }
//               res.status(200).json([onePost])
//             })
//         })
//       })
//     })
//   })
// };

// exports.getAllPosts = (req, res, next) => {
//   const userIdAuth = req.auth.userId;

//   db.query("SELECT * FROM `posts_users` ORDER BY createdAt DESC", (err, data) => {
//     let dataArray = data;
//     if (err) throw err
//     db.query("SELECT postId,userId FROM `likes`", (err, dataLikes) => {
//       if (err) throw err
//       db.query("SELECT postId, userId FROM `saves`", (err, dataSaves) => {
//         if (err) throw err
//         db.query("SELECT userId, followId FROM `follows`", (err, dataFollows) => {
//           if (err) throw err
//           db.query("SELECT * FROM `comments_pseudo` ORDER BY createdAt DESC", (err, dataComments) => {
//             if (err) throw err
//             for (let item of dataArray) {
//               item.notMyself = item.userId != userIdAuth
//               item.link = item.pseudo.toLowerCase().replace(" ", "-")
//               item.updated = Number(item.createdAt) !== Number(item.updatedAt)
//               let likesArray = dataLikes.filter(x => x.postId == item.postId).map(y => y.userId)
//               item.likes = likesArray.length
//               item.liked = likesArray.includes(userIdAuth)
//               let savesArray = dataSaves.filter(x => x.postId == item.postId).map(y => y.userId)
//               item.saves = savesArray.length
//               item.saved = savesArray.includes(userIdAuth)
//               let followsArray = dataFollows.filter(x => x.followId == item.userId).map(y => y.userId)
//               item.follows = followsArray
//               item.followed = followsArray.includes(userIdAuth)
//               let commentsArray = dataComments.filter(x => x.postId == item.postId)
//               item.comments = commentsArray
//               item.commentsCount = commentsArray.length
//               item.commentText = "";

//               for (let comment of commentsArray) {
//                 comment.updating = false;
//                 comment.updated = Number(comment.createdAt) !== Number(comment.updatedAt)
//               }
//             }
//             res.status(200).json(dataArray)
//           })
//         })
//       })
//     })
//   })
// };