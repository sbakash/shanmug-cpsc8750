// use the express library

const express = require('express');
const cookieParser = require('cookie-parser');





// create a new server application
const app = express();

// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;

const fetch = require('node-fetch');
const { json } = require('express');


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

//trivia page 
app.get("/trivia", async (req, res) => {
  // fetch the data
  const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");

  // fail if bad response
  if (!response.ok) {
    res.status(500);
    res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
    return;
  }

  // interpret the body as json
  const content = await response.json();

  // fail if db failed
  if (content.response_code !== 0) {
    res.status(500);
    res.send(`Open Trivia Database failed with internal response code ${data.response_code}`);
    return;
  }

  // respond to the browser
  // TODO: make proper html
   var results = content.results;
   var result = results[0];
   let catergory = result.category;
   let question = result.question;
   const correctAnswer = result.correct_answer;
   const options = result.incorrect_answers;
   options.push(correctAnswer);

   
   options.sort(() => Math.random() - 0.5)

  let difficulty = result.difficulty;
  const answerLinks = options.map(answer => {
    return `<a href="javascript:alert('${
      answer === correctAnswer ? 'Correct!' : 'Incorrect, Please Try Again!'
      }')">${answer}</a>`
});
  //  res.send(inCorrectAnswers);


    res.render('trivia', {category: catergory, question: question, answers: options, difficulty: difficulty, answerLinks: answerLinks})
});

// Start listening for network connections


app.listen(port);
app.use(express.static('public'));
app.set('view engine', 'ejs');


// Printout for readability
console.log("Server Started!");
