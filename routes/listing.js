const express=require("express");
const router = express.Router();
const wrapAsync =require("../utils/wrapAsyc.js");

const Listing=require("../models/listings.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");




//earlier all the below app.get ,app.post were in app.js file but now we have created different folder routes and 
//pasted below all of the apis and changed app to router.
//Also replace "/listings" with "/"
//Index Route
router.get("/", wrapAsync(async(req,res) => {

    //for testing the data is there
 // Listing.find({}).then((res) => {
 //     console.log(res);
 const allListings= await Listing.find({});
 res.render("listings/index.ejs",{allListings});

})
);

//New route
router.get("/new",isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

//Show Route
router.get("/:id",wrapAsync(async(req,res) => {
 let {id} =req.params;
 const listing=await Listing.findById(id)
 .populate({path:"reviews",
populate:{
    path:"author",
},
})
 .populate("Owner");
 //when i copy link and try to access the listing when it is deleted in other page.
 if(!listing){
    req.flash("error","Lisiting you requested for does not exist!");
    res.redirect("/listings");
}
//console.log(listing);
 res.render("listings/show.ejs",{listing});

})
);
//create route
router.post("/",isLoggedIn,validateListing,wrapAsync(async(req,res,next) => {
 
 // let {title,description,image,price,country,location} =req.body;


 // if(!req.body.listing){
 //     throw new ExpressError(400,"Send valid data for listing");
 // }
 // if(!newListing.title){
 //     throw new ExpressError(400,"Title is missing");
 // }
 // if(!newListing.description){
 //     throw new ExpressError(400,"Description is missing");
 // }
 const newListing=new Listing(req.body.listing);
 console.log(req.user);
 newListing.Owner=req.user._id;
 await newListing.save();
 req.flash("success","New Listing created");
 res.redirect("/listings");

})
);
//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async(req,res) =>{
    console.log(req.user);
 let{id} =req.params;
 const listing=await Listing.findById(id);
 if(!listing){
    req.flash("error","Lisiting you requested for does not exist!");
    res.redirect("/listings");
}
res.render("listings/edit.ejs",{listing});
})
);

//Update Route
router.put("/:id",
isLoggedIn,
isOwner,
validateListing,wrapAsync(async(req,res) =>{
let{id}= req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing});
req.flash("success","Listing updated");
res.redirect(`/listings/${id}`);
})
);

//Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res) =>{
 let{id}= req.params;
 let deletedListing= await Listing.findByIdAndDelete(id);
 console.log(deletedListing);
 req.flash("success","Listing deleted");
 res.redirect("/listings");
})
);

module.exports= router;