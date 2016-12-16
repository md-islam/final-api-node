var router = require('express').Router();

// setup boilerplate route jsut to satisfy a request
// for building

//route() will allow you to use same path for different HTTP operation.
//So if you have same URL but with different HTTP OP such as POST,GET etc
//Then use route() to remove redundant code.
router.route('/')
  .get(function(req, res, next){
    console.log('Hey from user!!');
    next(new Error('500 ERRROORRR'))
    res.send({ok: true});
  });

module.exports = router;


function errorHandler (err, req, res, next) {
  res.status(500)
  res.render('error', { error: err })
}