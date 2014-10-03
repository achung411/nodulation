var mongoose = require('mongoose')
  , fs = require('fs')
  , User = mongoose.model('User')
  , Post = mongoose.model('Post')
  , Comment = mongoose.model('Comment');

module.exports = {
//   intro: function (req, res) {
//     res.render('intro', {title: 'Welcome'});
//   },
//   index: function(req, res){
//     if (typeof req.session.current_user !== "undefined") {
//       res.render('index', { title: 'Nodular', me: req.session.current_user });
//     }
//     else {
//       res.redirect('/');
//     };
//  },
//  create_picture: function (req, res) {
//     var tmp_path = req.files.picture.path;
//     var target_path = './public/images/pics/' + req.files.picture.name;
//     fs.rename(tmp_path, target_path, function(err) {
//       if (err) throw err;
//       fs.unlink(tmp_path, function() {
//         if (err) {
//           throw err;
//         }
//         else {
//           User.findOne({_id: req.session.current_user._id }, 
//             function(err, result) {
//               if (err) {
//                 return handleError(err);
//               }
//               else {
//                 result.pic = '/images/pics/' + req.files.picture.name;
//                 result.updated_at = new Date();
//                 result.save(function(err) {
//                   if (err) {
//                     return handleError(err);
//                   }
//                   else {
//                     return res.redirect('/index');
//                   }
//                 });
//               }
//             }
//           );
//         }
//       })
//     });
//   },
//   create_cover: function(req, res) {   
//     var tmp_path = req.files.cover.path;
//     var target_path = './public/images/pics/' + req.files.cover.name;
//     fs.rename(tmp_path, target_path, function(err) {
//       if (err) {
//         return handleError(err);
//       }
//       else {
//         fs.unlink(tmp_path, function() {
//           if (err) {
//             return handleError(err);
//           }
//           else {
//             User.findOne({_id: req.session.current_user._id }, 
//               function(err, result) {
//                 if (err) {
//                   return handleError(err);
//                 }
//                 else {
//                   result.cover = '/images/pics/' + req.files.cover.name;
//                   result.updated_at = new Date();
//                   result.save(function(err) {
//                     if (err) {
//                       return handleError(err);
//                     }
//                     else {
//                       return res.redirect('/index');
//                     }
//                   });
//                 }
//               }
//             )
//           }
//         });
//       }
//     }); 
//   },
//   signout: function (req, res) {
//     var target_id = req.session.sessionID;
//     req.session.destroy(function() {
//       res.redirect('/');
//     });
//   },
// // ------------------- for debugging purposes ---------------
  test: function (req, res) {                 // this api call displays 
    Comment.find({}, function (err, results) {    // all posts in the database
      res.send(results);          
    });
  }  
}