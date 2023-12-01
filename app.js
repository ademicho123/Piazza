const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')

app.use(bodyParser.json())

//importing the post model
const Post = require('./models/post')

/*Connecting the post to the PostRoute*/
const postRoute = require('./routes/posts')
const authRoute = require('./routes/auth')

app.use('/api/post', postRoute)
app.use('/api/user', authRoute)

mongoose.connect(process.env.DB_CONNECTOR)
  .then(() => {
    console.log("Connected to MongoDB");
  })

// ********************************
app.post('/api/post', (req, res) => {
    // Extract data from the request body
    const { username, title, content } = req.body;
  
// Set expiration time
const expirationDate = new Date();
expirationDate.setMinutes(expirationDate.getMinutes() + expirationMinutes);

    // Create a new post instance
    const post = new Post({username, title, content, expirationDate});
  
    // Save the post to the database
    post.save()
      .then(savedPost => {
        res.status(201).json(savedPost);
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  

app.listen(3001, ()=>{
    console.log('Server is up and running')
})