const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')


app.use(bodyParser.json())



app.get('/', (req, res)=>{
    res.send(('Homepage'))
})


app.listen(3000, ()=>{
    console.log('Server is up and running')
})