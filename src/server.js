// use the express library

const express = require('express');
const cookieParser = require('cookie-parser');

//... code ...



// create a new server application
const app = express();

// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;


let nextVisitorId = 1;

const date = new Date();
const dateString = date.toLocaleString();
let isAccessed = false;
let timeDifference = 0;
  


app.use(cookieParser());

// the main page

app.get('/', (req, res) => {
  if(req.cookies.visited !== undefined)
  {
    isAccessed = true;
    
    timeDifference = Date.now()- req.cookies.visited;
    timeDifference= Math.ceil(timeDifference/3600);
  }
 res.cookie('visitorId', nextVisitorId++);
   res.cookie('visited', Date.now());
   
  res.render('welcome', {
    name: req.query.name ||  "World", visitorId: nextVisitorId,visitedTime:dateString,
    time: timeDifference > 0 ? `It has been ${timeDifference} seconds since your last visit` : "You have never visited"
  });
});
// Start listening for network connections


app.listen(port);
app.use(express.static('public'));
app.set('view engine', 'ejs');


// Printout for readability
console.log("Server Started!");
