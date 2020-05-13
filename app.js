const express           = require("express"),
      app               = express(),
      bodyParser        = require("body-parser"),
      mongoose          = require("mongoose"),
      flash             = require("connect-flash"),
      passport          = require("passport"),
      LocalStrategy     = require("passport-local"),
      methodOverride    = require("method-override"),
      User              = require("./models/user");

const commentRoutes     = require("./routes/comments"),
      campgroundsRoutes = require("./routes/campgrounds"),
      indexRoutes       = require("./routes/index");

mongoose.connect(process.env.DBURL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: process.env.CSCRT,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, () => {
    console.log("Starting YelpCamp at " + process.env.PORT);
});