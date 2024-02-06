const mongoose= require("mongoose");
const { listingSchema } = require("../schema");
const Schema= mongoose.Schema;
const Review= require("./review.js");

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
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },

    ],
});

ListingSchema.post("findOneAndDelete",async(listing) =>{
    if(listing){
        await Review.deleteMany({_id :{$in: listing.reviews}});
    }


});

const Listing= mongoose.model("Listing",ListingSchema);
module.exports= Listing;