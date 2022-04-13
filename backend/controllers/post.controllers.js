const db = require('../config/db');
// require('dotenv').config({path: '../config/.env'});
require('dotenv').config();
const Post = require('../models/post.models');
const jwt = require('jsonwebtoken');

//CRUD Post
exports.getPosts = (req,res,next) => {
    res.status(200).json({message: "Here all the posts !"});
    res.status(400).json(err => console.log(err));
};
exports.getPost = (req,res,next) => {
    res.status(200).json({message: `Here the post ${req.params.id} !`});
};

exports.createPost = (req,res,next) => {
    const post = new Post({
        userId: req.body.userId,
        description: req.body.description,
        media: req.body.media
    });
    Post.create(post, (err, data) => {
        if(err){
            console.log(err)
            return res.status(400).json(err)
        }
        res.status(201).json(data);
    })
};





exports.putPost = (req,res,next) => {
    res.status(200).json({message: `Post ${req.params.id} updated !`});
};
exports.deletePost = (req,res,next) => {
    res.status(200).json({message: `Post ${req.params.id} deleted !`});
};

//CRUD Comment
exports.getAllComments = (req,res,next) => {
    res.status(200).json({message: "Here all the comments !"});
};
exports.getPostComments = (req,res,next) => {
    res.status(200).json({message: `Here the comments of the post ${req.params.id} !`});
};
exports.getPostComment = (req,res,next) => {
    res.status(200).json({message: `Here the comment ${req.params.number} of the post ${req.params.id} !`});
};
exports.postComment = (req,res,next) => {
    res.status(201).json({message: `Comment for post ${req.params.id} created !`});
};
exports.putComment = (req,res,next) => {
    res.status(200).json({message: `Comment ${req.params.number} for post ${req.params.id} updated !`});
};
exports.deleteComment = (req,res,next) => {
    res.status(200).json({message: `Comment ${req.params.number} for post ${req.params.id} deleted !`});
};

//Create database
// app.get('/createdb', (req,res) => {
//     let sql = 'CREATE DATABASE mydb';
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         // console.log(result);
//         res.send("Database created !");
//     });
// });

//Create table
exports.createpoststable = (req,res) => {
    let sql = 'USE `db_groupy`; CREATE TABLE posts(id INT AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send("Posts table created !");
    });
};

//Create post 1
exports.addPost = (req,res) => {
    db.query(
        "INSERT INTO posts SET ?", 
        {title: 'Post 1', body: 'This is post 1 !'}, 
        (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send("Post 1 created !");
    });
};

//Create post 2
// app.get('/addpost2', (req,res) => {
//     let post ={title: 'Post 2', body: 'This is post 2 !'};
//     let sql = 'INSERT INTO posts SET ?';
//     let query = db.query(sql, post, (err, result) => {
//         if (err) throw err;
//         // console.log(result);
//         res.send("Post 2 created !");
//     });
// });

//Select all posts
// app.get('/getposts', (req,res) => {
//     let sql = 'SELECT * FROM posts';
//     let query = db.query(sql, (err, results) => {
//         if (err) throw err;
//         console.log(results);
//         res.status(200).json({message:"Here the posts !"});
//         res.send("Here the posts !");
//     });
// });

//Select one post
// app.get('/getpost/:id', (req,res) => {
//     let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send(`Here the post ${req.params.id}!`);
//     });
// });

//Update post
// app.get('/updatepost/:id', (req,res) => {
//     let newTitle = 'Updated title';
//     let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = '${req.params.id}'`;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send(`Post ${req.params.id} updated !`);
//     });
// });

//Delete post
// app.get('/deletepost/:id', (req,res) => {
//     let sql = `DELETE FROM posts WHERE id = '${req.params.id}'`;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send(`Post ${req.params.id} deleted !`);
//     });
// });