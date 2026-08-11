const Review = require("../Models/reviews.js");
const Listing = require("../Models/listing.js");


module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    //pusing new review at every time to the listing 
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("New Review Saved");
    req.flash("success","New Review Created!!");
    res.redirect(`/listings/${listing._id}`);
};
module.exports.destoryReview=async (req, res) => {
     // Destructure 'id' (listing id) and 'reviewId' from params
    let { id, reviewId } = req.params;
     // 1. Remove the review reference from the Listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // 2. Delete the actual Review document
    // This is where "Review is not defined" triggers if the import is missing
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
};