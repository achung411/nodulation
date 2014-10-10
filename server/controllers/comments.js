var mongoose = require('mongoose')
  , fs = require('fs')
  , User = mongoose.model('User')
  , Post = mongoose.model('Post')
  , Comment = mongoose.model('Comment');

module.exports = {

// ------------------- for debugging purposes ---------------
  // test: function (req, res) {                 // this api call displays 
  //   Comment.find({}, function (err, results) {    // all posts in the database
  //     res.send(results);          
  //   });
  // }  
}