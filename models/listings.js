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
        url:String,
        filename:String,
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
    Owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type:{
            type:String,    //Dont do '{ location:{type:String}}'
            enum:['Point'],  //location type must be a 'point'
            required:true
        },
        coordinates:{
            type:[Number],
            required:true,
        }
    },
   
    // category:{
    //     type:String,
    //     enum:["mountains","arctic","fans","deserts"]

    // }

});

ListingSchema.post("findOneAndDelete",async(listing) =>{
    if(listing){
        await Review.deleteMany({_id :{$in: listing.reviews}});
    }


});

const Listing= mongoose.model("Listing",ListingSchema);
module.exports= Listing;