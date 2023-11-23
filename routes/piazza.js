const express = require('express')

const router = express.router()

router.get('/', (req, res)=>{
    res.send('This is Piazza router')

})

module.exports = router