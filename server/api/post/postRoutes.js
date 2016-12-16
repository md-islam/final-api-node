var router = require('express').Router();
var Post = require('./postModel.js');
var Category = require('../category/categoryModel.js');
var User = require('../user/userModel.js');


// setup boilerplate route jsut to satisfy a request
// for building
router.route('/')
  .get(function(req, res){
    Post
      .find({})
      .populate("author")
      .populate("categories")
      .exec(function(err, posts) {
        res.send({success: true, posts: posts});
      });
  })
  .post(function(req, res, next) {
    User.findOne({username: req.body.author}, function(err, user) {
      if (err) return next(err);
      if (!user) return next("No such user");

      Category.find({$or: req.body.categories.map(function(name) {
        return {name: name}
      })}, function(err, _categories) {
        if (req.body.categories.length == 0) _categories = [];
        if (err && req.body.categories.length != 0) return next(err);
        if (_categories.length != req.body.categories.length) return next("Couldn't find all categories.");

        Post.create({
          title: req.body.title,
          text: req.body.text,
          author: user,
          categories: _categories,
        }, function(err, user) {
          if (err) return next(err);
          res.send({success: true, user: user});
        });
      });
    });
  });

  router.route('/:post_id')
  .get(function(req, res, next){
    Post
      .findById(req.params.post_id)
      .populate("author")
      .populate("categories")
      .exec(function(err, post) {
      if (err) return next(err);
      if (!post) return next("No such post.");
      res.send({success: true, post: post});
    });
  })
  .put(function(req, res, next) {
    req.body.categories = req.body.categories || [];

    User.findOne({username: req.body.author}, function(err, user) {
      if (err && req.body.author) return next(err);
      if (!user && req.body.author) return next("Cannot find author");

      Category.find({$or: req.body.categories.map(function(name) {
        return {name: name}
      })}, function(err, _categories) {
        if (req.body.categories.length == 0) _categories = [];
        if (err && req.body.categories.length != 0) return next(err);
        if (_categories.length != req.body.categories.length) return next("Couldn't find all categories.");

        Post.findById(req.params.post_id, function(err, post) {
          if (err) return next(err);
          post.title = req.body.title;
          post.text = req.body.text;
          post.author = user;
          post.categories = _categories;
          post.save(function(err) {
            if (err) return next(err);
            res.send({success: true, post: post})
          })
        });
      });
    })
  })
  .delete(function(req, res, next) {
    Post.remove({_id: req.params.post_id}, function(err, post) {
      if (err) return next(err);
      res.send({success: true, post: post});
    });
  })

module.exports = router;