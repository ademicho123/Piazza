const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')

/*Connecting the post to the PostRoute*/
const postRoute = require('./routes/posts')



app.use('/api/post', postRoute)


mongoose.connect(process.env.DB_CONNECTOR)
  .then(() => {
    console.log("Connected to MongoDB");
  })

app.listen(3000, ()=>{
    console.log('Server is up and running')
})