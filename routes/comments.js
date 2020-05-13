const express       = require("express"),
      Campground    = require("../models/campground"),
      Comment       = require("../models/comments"),
      router        = express.Router({mergeParams: true}),
      middleware    = require("../middleware");

router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            req.flash("error", "Something went wrong :/")
            console.log(err);
        } else {
            req.flash("success", "Successfully added comment")
            res.render("comments/new", { campground: campground })
        }
    });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                    res.redirect("/campgrounds");
                } else {
                    comment.author.id = req.user.id,
                    comment.author.username = req.user.username,
                    // add username and id
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            Comment.findById (req.params.comment_id, (err, comment) => {
                if(err) {
                    res.redirect("back");
                } else {
                    res.render("comments/edit", {
                        campgroundId: req.params.id,
                        comment: comment
                    });
                }
            });
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
        if(err) {
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;