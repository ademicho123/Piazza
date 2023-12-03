const express = require('express')

const router = express.Router()
const mongoose = require('mongoose')

const User  = require('../models/user')
const Comment  = require('../models/comment')
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
        const commentsCount = post.comment ? post.comment.length : 0;
  
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

// Endpoint to get posts by category
router.get('/category/:category', verifyToken, async (req, res) => {
    try {
        const { category } = req.params;

        // Validate category
        const validCategories = ['tech', 'health', 'politics', 'sport'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ error: 'Invalid category' });
        }

        // Query posts based on the category
        const posts = await Post.find({ category })
            .populate('likes', 'username')
            .populate('dislikes', 'username')
            .populate('comment.username'); 

        // Fetch additional details for each post
        const postsWithDetails = await Promise.all(posts.map(async (post) => {
            const { _id, username, title, content, likes, dislikes, comment } = post;

            // Query the Comment model to get the actual number of comments
            const commentsCount = Array.isArray(comment) ? comment.length : 0;

            return {
                _id,
                username,
                title,
                content,
                likeCount: likes ? likes.length : 0,
                dislikeCount: dislikes ? dislikes.length : 0,
                commentCount: commentsCount,
            };
        }));

        res.status(200).json(postsWithDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Endpoint to like a post
router.post('/:postId/like', verifyToken, async (req, res) => {
    const { postId } = req.params;
  
    try {
        const post = await Post.findById(postId);
  
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
  
        const loggedInUser = req.user; // Assuming user details are stored in the token
  
        // Check if both post and loggedInUser are defined before accessing their properties
        if (loggedInUser && loggedInUser.username && loggedInUser.email &&
            post.username && post.userEmail &&
            post.username.toString() === loggedInUser.username.toString() &&
            post.userEmail.toString() === loggedInUser.email.toString()) {
            return res.status(403).json({ error: 'You cannot like your own post' });
        }
  
        // Check if the post has expired
        if (post.expirationDate && post.expirationDate <= new Date()) {
            await Post.findByIdAndUpdate(postId, { isExpired: true });
            return res.status(403).json({ error: 'Post has expired.' });
        }
  
        // Increment likes count only if the user is not the post owner
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

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const loggedInUser = req.user; // Assuming user details are stored in the token

        // Check if both post and loggedInUser are defined before accessing their properties
        if (loggedInUser && loggedInUser.username && loggedInUser.email &&
            post.username && post.userEmail &&
            post.username.toString() === loggedInUser.username.toString() &&
            post.userEmail.toString() === loggedInUser.email.toString()) {
            return res.status(403).json({ error: 'You cannot dislike your own post' });
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
  router.post('/:postId/comment', verifyToken, async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

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

        // Check if req.user and req.user._id are defined
        if (!req.user || !req.user._id) {
            return res.status(403).json({ error: 'Invalid user information' });
        }

        // Implement your logic for adding a comment to the post
        const comment = {
            username: req.user._id,
            content,
        };

         post.comment.push(comment);

        const updatedPost = await post.save();

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router