const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});
const createServer = require('./createServer');
const db = require('./db');


const server = createServer();

// TODO Use express middleware to handle cookies (JWT)
server.express.use(cookieParser());

// Decode the JWT so can get the userId on each request w/ own middleware 
server.express.use((req, res, next)=> {
    const {token} = req.cookies;
    if(token) {
        const {userId} = jwt.verify(token, process.env.APP_SECRET);
        // Put userId onto request for future requests to access
        req.userId = userId;
        console.log(req.userId);
    }
    next();
});

// TODO Use express middleware to populate current user 

server.start(
{
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL
    }
}, deets => {
    console.log(`Server is now running on port 
    http:/localhost:${deets.port}`);
});
