const express = require('express')

const router = express.Router()

const Post  = require('../models/post')
const verifyToken = require('../verifyToken')

router.get('/', verifyToken, async(req, res)=>{
    try{
        const post = await Post.find()
        res.send(post)
    }catch(err){
        res.status(400).send(end)
    }    
})

module.exports = router