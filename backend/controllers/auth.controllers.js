require('dotenv').config();
const User = require('../models/user.models');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.signup = (req, res, next) => {
  User.isUniqueUser(
    [req.body.pseudo, req.body.email],
    (err, response) => {
      if (err) throw err
      if (response == false) {
        return res.status(401).json({ message: "Non unique pseudo or email" });
      }
      bcrypt.hash(req.body.password, 5)
        .then(hash => {
          const user = new User({
            email: req.body.email,
            pseudo: req.body.pseudo,
            password: hash
          });
          User.create(user, (err) => {
            if (err) throw err
            res.status(201).json({ message: 'Created with success' });
          })
        })
        .catch(error => res.status(500).json(error))
    })
};

exports.login = (req, res, next) => {
  User.getUserByEmail(req.body.email, (err, userFound) => {
    const passwordEncoded = userFound === null ? '' : userFound.password
    bcrypt.compare(req.body.password, passwordEncoded)
      .then(valid => {
        if (!valid) {
          return res.status(401).json({ message: "Email ou mot de passe invalide " })
        }
        if (err) throw err;

        db.query("SELECT userId, followId FROM `follows`",
          (err, dataFollows) => {
            if (err) throw err
            userFound.follows = dataFollows[0]
            db.query("SELECT COUNT(userId) AS posts FROM `posts` WHERE userId = ?", [userFound.id], (err, data) => {
              if (err) throw err
              userFound.posts = data[0].posts
              res.status(200).json({
                followers: userFound.follows,
                isActive: userFound.isActive,
                isAdmin: userFound.isAdmin,
                link: userFound.pseudo.toLowerCase().replace(" ", "-"),
                picture: userFound.picture,
                posts: userFound.posts,
                pseudo: userFound.pseudo,
                userEmail: userFound.email,
                userId: userFound.id,
                token: jwt.sign(
                  {
                    id_user: userFound.id,
                    pseudo: userFound.pseudo,
                    isActive: userFound.isActive,
                    isAdmin: userFound.isAdmin
                  },
                  `${process.env.TOKEN_KEY}`,
                  { expiresIn: '24h' }
                )
              })
            })
          })
      })
      .catch(error => {
        console.log('Error 500', error)
        res.status(500).json({ message: "Erreur serveur" })
      }
      );
  })
};
