
//instead of using wrapSync and error middleware in the app.js to show error we will use ExpressError class
  //create route
//   app.post("/listings",wrapAsnc(async(req,res,next)=>{
//     
//         const newListing = new Listing(req.body.Listing);
//         await newListing.save();
//         res.redirect("/listings");
//    
//   })
 //);

//   app.use((err,req,res,next) =>{
//     res.semd("something went wrong");





class ExpressError extends Error{
    constructor(statusCode,message){
        super();
        this.statusCode=statusCode;
        this.message=message;


    }
}
module.exports=ExpressError;