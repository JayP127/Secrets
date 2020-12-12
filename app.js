//jshint esversion:6

//below are all the modules needed to run the application
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

//this expression defines the variable app as an instance of express
const app = express();

//this expression allows to run ejs files in the views folder
app.set('view engine', 'ejs');

//this expression is needed to be able to read the input text
app.use(bodyParser.urlencoded({
  extended: true
}));

//this expression is needed to make available the Public files to
// the application from anywhere
app.use(express.static("public"));

// this is to avoid the errors that Mongoose throws
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//this is a local connection- a web connection would need a url from
// the Mongo Atlas server
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});


const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username, //this is the same as the name in the input
    password: req.body.password // ditto, the same as the name in the input
  });

  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets"); //only if they register successfully, they are allowed in the secrets page
    }
  });
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        } else {
          console.log("error1");
        }
      } else {
        console.log("error2");
      }
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
