
var router = require('express').Router();
var Category = require('./categoryModel.js');

router.route('/')
  .get(function(req, res){
    console.log("Category GET all API CALLED");
    Category.find({}, function(err, categories) {
      res.send({success: true, categories: categories});
    })
  })
  .post(function(req, res, next) {
    console.log("category POST API CALLED");
    Category.create({
      name: req.body.name
    }, function(err, category) {
      if (err) return next(err);
      res.send({success: true, category: category});
    });
  });

router.route('/:category_id')
  .get(function(req, res, next){
    console.log("category get by id API CALLED");
    Category.findById(req.params.category_id, function(err, category) {
      if (err) return next(err);
      if (!category) return next("No such category.");
      res.send({success: true, category: category});
    });
  })
  .put(function(req, res, next) {
    console.log("category put update by id API CALLED");
    Category.findById(req.params.category_id, function(err, category) {
      if (err) return next(err);
      category.name = req.body.name
      category.save(function(err) {
        if (err) return next(err);
        res.send({success: true, category: category})
      })
    });
  })
  .delete(function(req, res, next) {
    console.log("category delete by id API CALLED");
    Category.remove({_id: req.params.category_id}, function(err, category) {
      if (err) return next(err);
      res.send({success: true, category: category});
    });
  })

module.exports = router;