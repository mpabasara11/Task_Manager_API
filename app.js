const express = require('express')
const app = express()
const port = 8080
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwtSecret = "secret"

//importing routes
const admin_routes = require('./routes/admin_routes.js')
const authentication_routes = require('./routes/authentication_routes.js')
const employee_routes = require('./routes/employee_routes.js')
const manager_routes = require('./routes/manager_routes.js')



app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(cookieParser());


//  middleware for request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });




//connect auth routes 
app.use('/auth',authentication_routes);


//middleware for cookie verification and tokel validation
app.use((req, res, next) => {

    //check if state_token cookie is present
    if(req.cookies.state_token)
    {
        console.log('cookie found');

        //verify the token
        jwt.verify(req.cookies.state_token,jwtSecret,(error,decodedToken) => {
            if(error)
            {
                console.log('Invalid token');
                res.status(401).json({error:'Invalid token'});
              //  next();
            }
            else
            {
                console.log('Token verified');

            //check the detail inside token and put them inside request object
            
            req.userName = decodedToken.userName;
            req.userRole = decodedToken.userRole;
            req.firstName = decodedToken.firstName;
            req.lastName = decodedToken.lastName;
            req.email = decodedToken.email;
            req.nic = decodedToken.nic;

            next();

               
            }
        });
    }
    else
    {
        console.log('cookie not found');
        res.status(401).json({error:'cookie not found'});

      // next();
    }

  });


//connect admin routes 
app.use('/admin',admin_routes);

//connect admin routes 
app.use('/employee',employee_routes);

//connect admin routes 
app.use('/manager',manager_routes);



connectToDb();




//////////////////////////////////////////////////////////////   Function definitions ///////////////////////////////////////////////////////////////////////////////


//entablish the connection with database
async function connectToDb()
{
  const uri = "mongodb+srv://mpabasara11:zxasd@cluster0.sktjibw.mongodb.net/TaskManagerAPI?retryWrites=true&w=majority";

    try
    {
       await mongoose.connect(uri);
        console.log("Connected to mongoDB");
        startServer();
    }
    catch(error)
    {
        console.error(error);


    }


}


function startServer()
{
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
}
