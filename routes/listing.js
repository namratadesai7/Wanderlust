const express=require("express");
const router = express.Router();
const wrapAsync =require("../utils/wrapAsyc.js");
const Listing=require("../models/listings.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');   //FOR UPLOADING FILES
const {storage}= require("../cloudConfig.js");
const upload= multer({storage});
// const upload= multer({dest:'uploads/'}); //when we want to save in local storage

//earlier all the below APP.USE,app.get ,app.post were in app.js file but now we have created different folder routes and 
//pasted below all of the apis and changed app to router.
//Also replace "/listings" with "/"
//Index Route
//create route
router.route("/")
.get(wrapAsync(listingController.index))        //as soon as we get "get" request we pass callbackfunction "index"
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));



//New route - we need to put it above the /:id route other wise router logic will conside "new" as id
//and try to find it in database
router.get("/new",isLoggedIn,listingController.renderNewForm );


//Show Route //Update Route //Delete Route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

module.exports= router;