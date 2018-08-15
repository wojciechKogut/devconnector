const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginrInput = require('../../validation/login');

//Load user model
const User = require('../../models/User');

//@route  GET api/users/register
//@desc   Register user
//@access Public
router.post('/register', (req, res) => {
    const errors = validateRegisterInput(req.body).errors;
    const isValid = validateRegisterInput(req.body).isValid;

    //check validation
    if (!isValid) {
        return res.status(400).json(errors)
    }

    User.findOne({ email: req.body.email })
        .then( user => {
            if (user) {
                errors.name = 'Email already exists';
                return res.status(400).json(errors);
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', // size
                    r: 'pg', //rating
                    d: 'mm', //default
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar: avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) =>{
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err)  throw err; 
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                });
            }
        })
})


//@route  GET api/users/login
//@desc   Login User / Returnig JWT Tokem
//@access Public
router.post('/login', (req, res) => {

    const { errors, isValid } = validateLoginrInput(req.body);

    const email = req.body.email;
    const password = req.body.password;

    //find user
    User.findOne({email: email})
        .then(user => {
            //check for user
            errors.email = 'Uesr not found';
            if (!user) {
                return res.status(404).json(errors);
            }

            //check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {

                        //generate token
                        const payload = { id: user.id, name: user.name, avatar: user.avatar }
                        jwt.sign(
                            payload, 
                            keys.secretOrKey, 
                            { expiresIn: 3600 },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                })
                        })
                    } else {
                        errors.password = 'Password incorrect';
                        return res.status(400).json(errors);
                    }
                })
        })
});


//@route  GET api/users/current
//@desc   Return current user
//@access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});

module.exports = router;