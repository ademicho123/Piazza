const mongoose = require('mongoose');
const User = require('../models/user');

const commentSchema = mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('comments', commentSchema);