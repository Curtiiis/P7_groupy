// require('dotenv').config({path: '../config/.env'});
require('dotenv').config();
const User = require('../models/user.models');
const jwt = require('jsonwebtoken');
// require('../utils/user');

const bcrypt = require('bcrypt');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 3)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                pseudo: req.body.pseudo,
                password: hash
            });
            User.create(user, (err, data) => {
                // if (err) {
                //     console.log(err)
                //     return res.status(401).json(err.sqlMessage)
                // }
                if (err != null && err.sqlMessage.includes('email')) {
                    console.log(err.sqlMessage)
                    return res.status(401).json({ message: "Cet email est déjà associé à un compte" })
                }
                else if (err != null && err.sqlMessage.includes('pseudo')) {
                    console.log(err.sqlMessage)
                    return res.status(401).json({ message: "Ce pseudo est déjà pris" })
                } else {
                    return res.status(201).json(data);
                }
            })
        })
        .catch(error => { return res.status(500).json({ error }) })
};

exports.login = (req, res, next) => {
    User.getUserByEmail(req.body.email, (err, data) => {
        const passwordEncoded = data === null ? '' : data.password
        bcrypt.compare(req.body.password, passwordEncoded)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ message: "Email ou mot de passe invalide " })
                }
                if (err) throw err;
                res.status(200).json({
                    pseudo: data.pseudo,
                    userId: data.id,
                    token: jwt.sign(
                        { userId: data.id },
                        `${process.env.TOKEN_KEY}`,
                        { expiresIn: '24h' })
                });
            })
            .catch(error => {
                console.log('Error 500', error)
                res.status(500).json({ message: "Erreur serveur" })
            }
            );
    })
};

exports.forgot = (req, res, next) => {
    User.getUserByEmail(req.body.email, (err, data) => {
        if (data === null) {
            return res.status(401).json({ message: "Cet email n'est associé à aucun compte existant" })
        }
        if (err) throw err;
        res.status(200).json({
            pseudo: data.pseudo,
            userId: data.id,
            token: jwt.sign(
                { userId: data.id },
                `${process.env.TOKEN_KEY}`,
                { expiresIn: '24h' })
        });
    })
};

// exports.getOneUser = (req, res, next) => {
//     return res.status(200).json({ message: "Hello user !" })
// };