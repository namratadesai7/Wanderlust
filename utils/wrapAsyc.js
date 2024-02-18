

//it is a better way of writing try catch function
//for exapmle instead od doing this-

//const Listing = require("../models/listings");

  //create route
//   app.post("/listings",async(req,res,next)=>{
//     try{
//         const newListing = new Listing(req.body.Listing);
//         await newListing.save();
//         res.redirect("/listings");
//     }catch(err){
//         next(err)
//     }
//   })
//   app.use((err,req,res,next) =>{
//     res.semd("something went wrong");
//   })  we can do the following wrapasync and uss it in app.js file


module.exports= (fn) =>{
    return (req,res,next) =>{
        fn(req,res,next).catch(next);
    };

};