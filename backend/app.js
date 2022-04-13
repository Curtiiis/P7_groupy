// const http = require('http');
const express = require('express');
const app = express();
// require('dotenv').config({path: './config/.env'});
require('dotenv').config();
const cors = require('./config/cors')
// const path = require('path');
const userRoutes = require('./routes/user.routes');
const postsRoutes = require('./routes/post.routes');

//CORS
app.use(cors);

//Bodyparser
app.use(express.json());

//Initialisation des Routes
app.use('/api/auth', userRoutes);
app.use('/api/posts', postsRoutes);




app.listen(process.env.PORT, (err) => {
    if (err) throw err;
    console.log("Server listening on port " + process.env.PORT);
});

//Exporte le module app pour qu'il soit utilisable par server.js
module.exports = app;