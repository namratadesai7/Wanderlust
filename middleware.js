
const Listing= require("./models/listings");
const Review= require("./models/review");
const ExpressError =require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");  //joi

module.exports.isLoggedIn=(req,res,next) =>{
    //  console.log(req.path,"..",req.originalUrl)
    if (req.user === undefined || !req.isAuthenticated()) {
        //for finding redirect url
        //here below we have session object in req object and we are creating redirectUrl to store the originalUrl
        req.session.redirectUrl= req.originalUrl;
        req.flash("error", "You must be logged in to create a listing!");
        return res.redirect("/login");
    }
    next();
};
//passport does not have access to delete local variables
module.exports.saveRedirectUrl=(req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
       

    }
    next();
};

module.exports.isOwner=async (req,res,next) =>{
    let{id}= req.params;
let listing = await Listing.findById(id);
//this is for when someone tries to send api request to routes using postman ,hopscotch or plain js.
if(!listing.Owner.equals(res.locals.curruser._id)){
    req.flash("error","You don't have permission to edit");
   return  res.redirect(`/listings/${id}`);
}
next();
};

module.exports.validateListing= (req,res,next) =>{
    let {error}=listingSchema.validate(req.body);
   
    if(error){
        let errMsg= error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }

}

module.exports.validateReview= (req,res,next) =>{
    let {error}=reviewSchema.validate(req.body);
   
    if(error){
        let errMsg= error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor=async (req,res,next) =>{
let{id,reviewId}= req.params;
let review = await Review.findById(reviewId);
//this is for when someone tries to send api request to routes using postman ,hopscotch or plain js.
if(!review.author.equals(res.locals.curruser._id)){
    req.flash("error","You did not create this review");
    return res.redirect(`/listings/${id}`);
}
next();
};

