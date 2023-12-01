const express = require('express')

const router = express.Router()
const mongoose = require('mongoose')

const Post  = require('../models/post')
const verifyToken = require('../verifyToken')

// Endpoint to get all posts with counts of likes, dislikes, and comments
router.get('/', verifyToken, async (req, res) => {
    try {
      const posts = await Post.find()
      
      // Fetch additional details for each post (likes, dislikes, comments)
      const postsWithDetails = await Promise.all(posts.map(async (post) => {
        const likesCount = post.likes ? post.likes.length : 0;
        const dislikesCount = post.dislikes ? post.dislikes.length : 0;
        const commentsCount = post.comments ? post.comments.length : 0;
  
        return {
          _id: post._id,
          username: post.username,
          topic: post.title,
          content: post.content,
          expirationDate: post.expirationDate,
          isExpired: post.isExpired,
          likesCount,
          dislikesCount,
          commentsCount,
        };
      }));
  
      res.status(200).json(postsWithDetails);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }

});

// Endpoint to like a post
router.post('/:postId/like', verifyToken, async (req, res) => {
    const { postId } = req.params;
  
    // Validate that postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid postId' });
    }
  
    try {
      const post = await Post.findById(postId);
  
      // Check if the post exists
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Check if the post has expired
      if (post.expirationDate && post.expirationDate <= new Date()) {
        await Post.findByIdAndUpdate(postId, { isExpired: true });
        return res.status(403).json({ error: 'Post has expired.'});
      }
  
      // Implement your logic for liking the post
      const currentLikes = parseInt(post.likes) || 0;
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $set: { likes: currentLikes + 1 } },
        { new: true }
      );
  
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Endpoint to dislike a post
  router.post('/:postId/dislike', verifyToken, async (req, res) => {
    const { postId } = req.params;
  
    // Validate that postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid postId' });
    }
  
    try {
      const post = await Post.findById(postId);
  
      // Check if the post exists
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Check if the post has expired
      if (post.expirationDate && post.expirationDate <= new Date()) {
        await Post.findByIdAndUpdate(postId, { isExpired: true });
        return res.status(403).json({ error: 'Post has expired.' });
      }
  
      // Implement your logic for disliking the post
      const currentDislikes = parseInt(post.dislikes) || 0;

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $set: { dislikes: currentDislikes + 1 } },
        { new: true }
    );
  
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Endpoint to add a comment to a post
  router.post('/:postId/comments', verifyToken, async (req, res) => {
    const { postId } = req.params;
    const { username, content } = req.body;
  
    // Validate that postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid postId' });
    }
  
    try {
      const post = await Post.findById(postId);
  
      // Check if the post exists
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Check if the post has expired
      if (post.expirationDate && post.expirationDate <= new Date()) {
        await Post.findByIdAndUpdate(postId, { isExpired: true });
        return res.status(403).json({ error: 'Post has expired.' });
      }
  
      // Implement your logic for adding a comment to the post
      
      const updatedPost = await Post.findByIdAndUpdate(postId, { $push: { comments: { username, content } } }, { new: true });
  
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router