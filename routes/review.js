const express=require("express");
const router = express.Router({mergeParams: true});   //mergeparams so that params from parent route can be passed to child route
const wrapAsync =require("../utils/wrapAsyc.js");       //express router are a way to organize your Express application such that our primary app.js file does not become bloated
const ExpressError =require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listings.js");
const{validateReview,isLoggedIn,isReviewAuthor}= require("../middleware.js");
const reviewController=require("../controllers/review.js");
//REVIEWS
//Post
//replaced "/listings/:id/reviews" with ""
//isLoggedIn function for backend protection
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview) 
);

//Delete review route
router.delete("/:reviewId",
isLoggedIn,
isReviewAuthor,
wrapAsync(reviewController.destroyReview));

module.exports=router;