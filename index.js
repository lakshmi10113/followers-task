const express = require("express");
const mongoose = require('mongoose');

const app = express();
app.use(express.static("public"));

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/fruitdb",{useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    username: String,
    following: [{ name: String }],
    followers: [{ name: String }]
});

const User = mongoose.model("User", userSchema);

//Create a new user account
app.route("/users")
.post(function(req, res){
    const newUser = User({
      username: req.body.userName
    });
    newUser.save(function(err){
      if (!err){
        res.send("Successfully added a new user.");
      } else {
        res.send(err);
      }
    });
  })


//Retrieve a specific user by username
app.route("/users/:username")
.get(function(req, res){
  const userTitle = req.params.username;
  User.findOne({username: userTitle}, function(err, usr){
    if (usr){
      const jsonUser = JSON.stringify(usr);
      res.send(jsonUser);
    } else {
      res.send("No user with that name found.");
    }
  });
})

// Retrieve a list of followers for a specific user
app.route("/users/:username/followers")
.get(function(req, res){
  const userTitle = req.params.username;
  User.findOne({username: userTitle}, function(err, usr){
    if (usr){
      const jsonUser = JSON.stringify(usr.followers);
      res.send(jsonUser);
    } else {
      res.send("No user with that name found.");
    }
  });
})

//  Retrieve a list of users a specific user is following
app.route("/users/:username/following")
.get(function(req, res){
  const userTitle = req.params.username;
  User.findOne({username: userTitle}, function(err, usr){
    if (usr){
      const jsonUser = JSON.stringify(usr.following);
      res.send(jsonUser);
    } else {
      res.send("No user with that name found.");
    }
  });
})

//Follow a specific user
app.route("/users/:username/follow")
.patch(function(req, res){
    const userTitle = req.params.username;
    User.findOneAndUpdate(
      {username: userTitle},
      {followers: req.body.newFollow},
      function(err){
        if (!err){
          res.send("Successfully updated.");
        } else {
          res.send(err);
        }
      });
  })

//Unfollow a specific user
app.route("/users/:username/follow")
  .delete(function(req, res){
    const userTitle = req.params.username;
    User.findOneAndDelete({username: userTitle}, function(err){
      if (!err){
        res.send("Successfully deleted selected user.");
      } else {
        res.send(err);
      }
    });
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});