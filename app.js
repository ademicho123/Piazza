const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')

app.use(bodyParser.json())

/*Connecting the post to the PostRoute*/
const postRoute = require('./routes/posts')
const authRoute = require('./routes/auth')

app.use('/api/post', postRoute)
app.use('/api/user', authRoute)


mongoose.connect(process.env.DB_CONNECTOR)
  .then(() => {
    console.log("Connected to MongoDB");
  })

app.listen(3001, ()=>{
    console.log('Server is up and running')
})