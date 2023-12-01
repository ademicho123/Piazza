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
    dislikes:{
        type:String
    },
    comment:{
        type:String
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    isExpired: {
        type: Boolean,
        default: false,
    }
})

module.exports = mongoose.model('posts',postSchema)
