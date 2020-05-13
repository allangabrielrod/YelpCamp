const express = require("express"),
      router  = express.Router(),
      passport = require("passport"),
      User = require("../models/user"),
      middleware = require("../middleware/index");

router.get("/", (req, res) => {
    res.render("landing");
});

// AUTH ROUTES
router.get("/register", middleware.notLoggedIn, (req, res) => {
    res.render("register")
});

// Sign up logic
router.post("/register", middleware.notLoggedIn, (req, res) => {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, usr) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }

        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to yelpcamp " + usr.username);
            res.redirect("/campgrounds");
        });
    })
});

//Login form
router.get("/login", middleware.notLoggedIn,(req, res) => {
    res.render("login");
});

//Handling login
router.post("/login", middleware.notLoggedIn, passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }));

//add logout route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out.");
    res.redirect("/campgrounds");
});

module.exports = router;