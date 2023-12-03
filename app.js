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
app.post('/api/post/create', async (req, res) => {
    try {
      // Extract data from the request body
      const { username, title, content, category, expirationMinutes } = req.body;
  
      // Validate expirationMinutes
      if (!expirationMinutes || isNaN(expirationMinutes)) {
        return res.status(400).json({ error: 'Invalid expirationMinutes' });
      }
  
      // Set expiration time
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + parseInt(expirationMinutes));
  
      // Validate category
      const validCategories = ['politics', 'health', 'sport', 'tech'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ error: 'Invalid category' });
      }
  
      // Create a new post instance
      const post = new Post({ username, title, content, category, expirationDate });
  
      // Save the post to the database
      const savedPost = await post.save();
  
      res.status(201).json(savedPost);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

app.listen(3000, ()=>{
    console.log('Server is up and running')
})