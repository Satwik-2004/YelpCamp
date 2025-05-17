const Campground = require('../models/camground');
const Review = require('../models/review');

module.exports.createReview = async (req,res)=> {
    const campground= await Campground.findById(req.params.id);
    const review= new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview= async (req,res) => {
    const {id, reviewID }= req.params;
    await Campground.findByIdAndUpdate(id, { $pull: {review: reviewID} } );
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Succesfully deleted review');
    res.redirect(`/campgrounds/${id}`);
};