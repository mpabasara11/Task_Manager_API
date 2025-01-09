const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../db_schema_models/user_model.js');
const bcrypt = require('bcrypt');


//middleware for checking request object contain a userRole as manager
router.use((req,res,next) => {
    if(req.userRole === 'manager')
    {
        next();
    }
    else
    {
        res.status(403).json({error:'Forbidden'});
    }
}
)


















module.exports = router;