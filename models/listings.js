const mongoose= require("mongoose");


const ListingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
    default:
        "https://unsplash.com/photos/a-person-swimming-over-a-coral-reef-with-lots-of-fish-xDQKvPjxtxo",
        type:String,
        set:(v) => 
        v === "" 
        ? "https://unsplash.com/photos/a-person-swimming-over-a-coral-reef-with-lots-of-fish-xDQKvPjxtxo" 
        : v,
    },    
    price:Number,
    location:String,
    country:String,
});

const Listing= mongoose.model("Listing",ListingSchema);
module.exports= Listing;