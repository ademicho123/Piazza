const mongoose = require('mongoose')

const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

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
    comment: {
        type: [{
            username: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
            },
            content: {
                type: String,
            },
        }],
        ref: 'comments',
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    isExpired: {
        type: Boolean,
        default: false,
    },
    category: {
        type: String, 
        enum: ['politics', 'health', 'sport', 'tech'],
    }
})

module.exports = mongoose.model('posts',postSchema)
