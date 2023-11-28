const mongoose = require('mongoose')

const titleSchema = mongoose.Schema({
    title:{
        type:String
    }

})

module.exports = mongoose.model('films',titleSchema)