const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../Models/reviews.js");
const Listing = require("../Models/listing.js");
const wrapAsync = require("../util/wrapAsync.js");
const { isLoggedIn,Validate_reviews, isReviewAuthor } = require("../middleware.js");
const reviewController=require("../Controller/reviews.js")
//Validation Error function for reviews in middleware

//Create review
router.post("/",isLoggedIn, Validate_reviews, wrapAsync(reviewController.createReview));

//Delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destoryReview));

module.exports=router;