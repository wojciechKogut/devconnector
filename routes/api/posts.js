const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const validatePostInput = require('../../validation/post');

/**
 * @Route GET api/posts
 * @Desc  get post
 * @Access public
 */
router.get('/', (req, res) => {
    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err => res.status(404))
});

/**
 * @Route GET api/posts/:id
 * @Desc  get post by id
 * @Access public
 */
router.get('/:id', (req, res) => {
    Post.find({_id: req.params.id})
        .then(post => res.json(post))
        .catch(err => res.status(404).json({nopostfound: 'No post found with this id'}));
});

/**
 * @Route POST api/posts
 * @Desc  create post
 * @Access Private
 */
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validatePostInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));
});

/**
 * @Route DELETE api/posts/:id
 * @Desc  delete post
 * @Access Private
 */
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({ user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //check the post owner
                    if (post.user.toString() !== req.user.id) {
                        return res.status(401).json({ notauthorized: 'User not authorized'});
                    }

                    post.remove().then(() => res.json({ success: true }));
                })
                .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
        })
});


/**
 * @Route POST api/posts/like/:id
 * @Desc  like post
 * @Access Private
 */
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({ user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //check if user likes post
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({ alreadyliked: 'User already liked this post'});
                    }

                    //add user id to likes array
                    post.likes.unshift({ user: req.user.id });

                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
        })
});

/**
 * @Route POST api/posts/unlike/:id
 * @Desc  unlike post
 * @Access Private
 */
router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({ user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //check if user likes post
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        return res.status(400).json({ noliked: 'You have not yet liked this post'});
                    }

                    //get the remove index
                    const removeIndex = post.likes  
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);

                        //splice out of array
                        post.likes.splice(removeIndex, 1);

                        //save
                        post.save().then((post) => res.json(post));

                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
        })
});


/**
 * @Route POST api/posts/comment/:id
 * @Desc  add comment to post
 * @Access Private
 */
router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validatePostInput(req.body);

    if (!isValid) {
        return res.status(404).json(errors);
    }

    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }

            //add to comments array
            post.comments.unshift(newComment);

            //save
            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found'}));
});


/**
 * @Route DELETE api/posts/comment/:id/:comment_id
 * @Desc  remove comment from post
 * @Access Private
 */
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            //check to see if comment exists
            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                return res.status(404).json({ commentnotexists: 'Comment does not exists'});
            }

            //get remove index
            const removeIndex = post.comments
                .map(item => item._id.toString())
                .indexOf(req.params.comment_id);

            //splice commet out of array
            post.comments.splice(removeIndex, 1);

            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found'}));
});

module.exports = router;