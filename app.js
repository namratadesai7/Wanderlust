const express= require("express");
const app=express();
const mongoose= require('mongoose');
const Listing=require("./models/listings.js");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");   //helps in creating templates/layers
const wrapAsync =require("./utils/wrapAsyc.js");
const ExpressError =require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");


const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB")
})
.catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); //to parse all the data
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res) => {
    res.send("Hi,I am root");
});

const validateListing= (req,res,next) =>{
    let {error}=listingSchema.validate(req.body);
   
    if(error){
        let errMsg= error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }

}
//Index Route
app.get("/listings", wrapAsync(async(req,res) => {

       //for testing the data is there
    // Listing.find({}).then((res) => {
    //     console.log(res);
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});

})
);

//New route
app.get("/listings/new",(req,res) =>{
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id",wrapAsync(async(req,res) => {
    let {id} =req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})
);
//create route
app.post("/listings",validateListing,wrapAsync(async(req,res,next) => {
    
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
    await newListing.save();
    res.redirect("/listings");
 
})
);
//Edit Route
app.get("/listings/:id/edit", wrapAsync(async(req,res) =>{
    let{id} =req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})
);

//update Route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res) =>{
    let{id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
})
);

//Delete Route
app.delete("/listings/:id",wrapAsync(async(req,res) =>{
    let{id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})
);
// app.get("/testListing",async (req,res) => {
//     let sampleListing= new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"calangute,Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.all("*",(req,res,next) =>{
    next(new ExpressError(404,"Page Not Found!"));
})
app.use((err,req,res,next) =>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.render("error.ejs",{message});
    //res.status(statusCode).send(message);
});

app.listen(5500,() =>{
    console.log("Server is listening to port 5500");
});