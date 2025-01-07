const express = require('express')
const app = express()
const port = 8080
const cors = require('cors');
const mongoose = require('mongoose');


//importing routes
const admin_routes = require('./routes/admin_routes.js')
const authentication_routes = require('./routes/authentication_routes.js')



app.use(cors()); // Enable CORS for all routes
app.use(express.json());


//  middleware for request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });



//connect auth routes 
app.use('/auth',authentication_routes);


//connect admin routes 
app.use('/admin',admin_routes);




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
