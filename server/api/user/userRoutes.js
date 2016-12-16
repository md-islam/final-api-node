var router = require('express').Router();
var User = require('./userModel.js');

// setup boilerplate route jsut to satisfy a request
// for building

//route() will allow you to use same path for different HTTP operation.
//So if you have same URL but with different HTTP OP such as POST,GET etc
//Then use route() to remove redundant code.

// // PART A SOLVED AND COMMENTED FOR YOUR CONVINIENCE
// router.route('/')
//   .get(function(req, res, next){
//     console.log('Hey from user!!');
//     next(new Error('500 ERRROORRR'))
//     res.send({ok: true});
//   });



router.route('/')
  .get(function(req, res){
    User.find({}, function(err, users) {
      res.send({success: true, users: users});
    })
  })
  .post(function(req, res, next) {
    User.create({
      username: req.body.username,
      address: req.body.address
    }, function(err, user) {
      if (err) return next(err);
      console.log("USER POST API CALLED");
      res.send({success: true, user: user});
    });
  });

router.route('/:user_id')
  .get(function(req, res, next){
    User.findById(req.params.user_id, function(err, user) {
      if (err) return next(err);
      if (!user) return next("No such user.");
      console.log("USER GET BY ID API CALLED");
      res.send({success: true, user: user});
    });
  })
  .put(function(req, res, next) {
  	console.log("USER PUT/UPDATE BY ID CALLED")
    User.findById(req.params.user_id, function(err, user) {
      if (err) return next(err);
      user.username = req.body.username;
      user.address = req.body.address;
      user.save(function(err) {
        if (err) return next(err);

        res.send({success: true, user: user})
      })
    });
  })
  .delete(function(req, res, next) {
    User.remove({_id: req.params.user_id}, function(err, user) {
      if (err) return next(err);
      console.log("USER DELETE API CALLED");
      res.send({success: true, user: user});
    });
  })

module.exports = router;


function errorHandler (err, req, res, next) {
  res.status(500)
  res.render('error', { error: err })
}