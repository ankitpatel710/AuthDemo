var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

var mongoose = require("mongoose");
passport = require("passport");
passportLocal = require("passport-local");
passportLocalMongoose = require("passport-local-mongoose");
User = require("./models/user");

var url = process.env.DATABASEURL || "mongodb://localhost:27017/auth_demo";
mongoose.connect(url, { useNewUrlParser: true });
console.log(url);

var bodyParser = require("body-parser");

app.use(
  require("express-session")({
    secret: "This is Ankit Patel",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res) {
  res.render("secret");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    function(err, user) {
      if (err) {
        console.log(err);
        return res.render("register");
      } else {
        passport.authenticate("local")(req, res, function() {
          res.render("secret");
        });
      }
    }
  );
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}
var port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function() {
  console.log(" Server Has Started! on envirment");
  console.log(port);
});
