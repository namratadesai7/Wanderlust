const express= require("express");
const app=express();
const mongoose= require('mongoose');
const Listing=require("./models/listings.js");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");   //helps in creating templates/layers


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

//Index Route
app.get("/listings", async(req,res) => {
    //for testing the data is there
    // Listing.find({}).then((res) => {
    //     console.log(res);
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//New route
app.get("/listings/new",(req,res) =>{
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id",async(req,res) => {
    let {id} =req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//create route
app.post("/listings",async(req,res) => {
    // let {title,description,image,price,country,location} =req.body;
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async(req,res) =>{
    let{id} =req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//update Route
app.put("/listings/:id",async(req,res) =>{
    let{id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id",async (req,res) =>{
    let{id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});
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

app.listen(5600,() =>{
    console.log("Server is listening to port 5600");
});