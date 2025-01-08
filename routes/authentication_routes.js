const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../db_schema_models/user_model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = "secret"



router.post('/signin',(req,res)=>
    {
        const userName = req.body.userName
        const password = req.body.password


        //check if username exists
        User.findOne({userName:userName})
        .then(user => {
            if(user)
            {
                //compare the password
                bcrypt.compare(password, user.passwordHashCode, function(err, result) {
                    if(result)
                    {
                        console.log('User signed in');
                       // res.status(200).json({message:'User signed in'});

                          //generate a token
                            const token = jwt.sign({
                                userName    : user.userName,
                                userRole    : user.userRole,
                                firstName   : user.firstName,
                                lastName    : user.lastName,
                                email       : user.email,
                                nic         : user.nic
                            },jwtSecret,{expiresIn:'1h'});

                            res.cookie('state_token',token,
                                {
                                    httpOnly: true,       // Prevent JavaScript access to the cookie
                                    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
                                    maxAge: 3600000,      // Optional: Set expiration time (in ms)
                                });
                            res.status(200).json({message:'User signed in'});
                    }
                    else
                    {
                        console.log('Incorrect password');
                        res.status(401).json({error:'Incorrect password'});
                    }
                });
            }
            else
            {
                console.log('User not found');
                res.status(404).json({error:'User not found'});
            }
        })
    })


router.post('/signout',(req,res)=>
    {
        try{
        res.clearCookie('state_token',{httpOnly: true,secure: process.env.NODE_ENV === 'production'});
        res.status(200).json({ message: 'User signed out' });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred while signing out' });
    }
    })



module.exports = router;