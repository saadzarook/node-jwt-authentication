const router = require('express').Router();
const User  = require('../models/User');
const {registerValidation} = require('../validation');
const {loginValidation} = require('../validation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//REGISTER
router.post('/register', async (req, res) => {
    
    //PRE DATA VALIDATIOM
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //CHECK FOR EXISTING USER DETAILS
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //CREATE NEW USER OBJECT
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({user: savedUser._id});
    }catch(err){
        res.status(400).send(err);
    }
});


//LOGIN
router.post('/login', async (req, res) => {
    //PRE DATA VALIDATIOM
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //CHECK IF EMAIL EXISTS
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email doesn\'t exist!');
    //CHECK IF PASSWORD IS CORRECT
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Email or password is wrong!');

    //CREATE JWT TOKEN AND ASSIGN
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;