const express=require("express");
const router = express.Router({mergeParams: true});   //mergeparams so that params from parent route can be passed to child route
const wrapAsync =require("../utils/wrapAsyc.js");       //express router are a way to organize your Express application such that our primary app.js file does not become bloated
const ExpressError =require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listings.js");
const{validateReview,isLoggedIn,isReviewAuthor}= require("../middleware.js");

//REVIEWS
//Post
//replaced "/listings/:id/reviews" with ""
//isLoggedIn function for backend protection
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);  // we have used merge params in routee object to access the id passed to parent route in app.js file
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review submitted");

    res.redirect(`/listings/${listing._id}`); 

}) 
);

//Delete review route
router.delete("/:reviewId",
isLoggedIn,
isReviewAuthor,
wrapAsync(async(req,res) => {
    let{id,reviewId}= req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review deleted");
    res.redirect(`/listings/${id}`);

}));

module.exports=router;