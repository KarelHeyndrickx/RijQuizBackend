let mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

let Question = mongoose.model("Question");
let Settings = mongoose.model("Settings");

/* GET questions . */
router.get('/API/questions/', function(req, res, next) {
  Question.find(function(err, questions){
    if (err){
      return next(err);
    }
    return res.json(questions);
  });
});

/* GET settings . */
router.get("/API/settings/", function (req, res, next) {
  let query = Settings.findOne({});
  query.exec(function (err, settings) {  
    if (err || settings.length == 0)
      return next(new Error("Settings were not found"));
    res.json(settings);

  })
});

/* POST question . */
router.post("/API/question/",function(req,res,next){
  let question = new Question(req.body);
  question.save(function(err, rec){
    if (err){return next(err);}
    res.json(rec);
  })
});


router.param('question', function (req, res, next,id){
  let query = Question.findById(id);
  query.exec(function(err,question){
    if(err){
      return next(err);
    }
    if (!question){
      return next (new Error('Question with id ' + id + ' not found'));      
    }
    req.question = question;
    return next();

  })
})

router.delete('/API/question/:question', function(req, res){
  req.question.remove(function(err){
    if(err){
      return next(err);
    }
    res.json(req.question);
  })
});

module.exports = router;
