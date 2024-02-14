const Listing=require("../models/listings.js");
//for geocoding copy these from mapbox-sdk-js on githib from readme // we are using sdk instead of the api as it is relatively easy


const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); // Note: Use geocoding instead of tilesets
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index=async(req,res) => {

 const allListings= await Listing.find({});
 res.render("listings/index.ejs",{allListings});

};

module.exports.renderNewForm=async(req, res) => {
    res.render("listings/new.ejs");
}


module.exports.showListing= async(req,res) => {
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
   
   };

module.exports.createListing=async(req,res,next) => {
   let response= await geocodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit:1,
    })
    .send();

 
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
    let url= req.file.path;
    let filename=req.file.filename;
    console.log(url,"..",filename);
    const newListing=new Listing(req.body.listing);

    newListing.Owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    // console.log(savedListing);
    req.flash("success","New Listing created");
    res.redirect("/listings");
   
 
   };

module.exports.renderEditForm= async(req,res) =>{
    let{id} =req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Lisiting you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_100,w_250");  //this is done because of cloudinary
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing=async(req,res) =>{
        let{id}= req.params;
        let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url= req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }

        req.flash("success","Listing updated");
        res.redirect(`/listings/${id}`);
};

module.exports.destroyListing =async(req,res) =>{
    let{id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
};
       