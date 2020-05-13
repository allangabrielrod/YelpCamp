const express       = require("express"),
      router        = express.Router({mergeParams: true}),
      Campground    = require("../models/campground"),
      middleware    = require("../middleware");

router.get("/", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log("Something went wrong :/")
        } else {
            res.render("campgrounds/campgrounds", { campgrounds: allCampgrounds });
        }
    });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.post("/", middleware.isLoggedIn, (req, res) => { 
    req.body.campground.author = {
        id: req.user._id,
        username: req.user.username
    };
 
    Campground.create(req.body.campground, (err, newlyCreated) => {
        if (err) {
            console.log("Something went wrong :/")
        } else {
            console.log(newlyCreated);
        }
    });
    res.redirect("campgrounds/campgrounds");
});

router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash("err", "Campgorund not found!")
            res.redirect("/campgrounds");
        }
        else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
        if(err) {
            res.redirect("/campgrounds/" + req.params.id + "/edit");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err) => {
        if(err) {
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            res.redirect("/campgrounds/");
        }
    });
});

module.exports = router;