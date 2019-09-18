const express = require('express');
const app = express();
const  mongoose = require('mongoose');
const  dotenv = require('dotenv');

//IMPORT ROUTES
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');

dotenv.config(); 
//CONNECT TO DB
mongoose.connect(
    process.env.CONNECTION_STRING, 
    { useNewUrlParser: true} ,
    () => console.log('Connected to DB')
);

//MIDDLEWARES
app.use(express.json());
//ROUTE MIDDLEWARES
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(3000, () => console.log("Up and running!"));