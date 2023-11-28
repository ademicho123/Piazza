const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    username:{
        type:String
    },
    title:{
        type:String
    },
    content:{
        type:String
    },
    likes:{
        type:String
    },
    comment:{
        type:String
    },
    dislike:{
        type:String
    }
})

module.exports = mongoose.model('films',postSchema)
