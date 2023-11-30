const express = require('express')

const router = express.Router()

const Post  = require('../models/post')

router.get('/', async(req, res)=>{
    try{
        const post = await post.find()
        res.send(posts)
    }catch(err){
        res.status(400).send({message})
    }    
})

module.exports = router