
const User= require("../models/user");

module.exports.renderSignup=(req,res) => {
    res.render("users/signup.ejs");
}

//with wrapasync a flash message is displayed but on differnet page we want
//also redirect it to the signup page again so we will use try catch as well
module.exports.signup= async(req,res)=>{
    try{
     let {username,email,password}= req.body;
     const newUser=new User({email,username});
     const registerdUser=await User.register(newUser,password);
     console.log(registerdUser);
     req.login(registerdUser,(err)=>{
         if(err){
             return next(err);
 
         }
         req.flash("success","Welcome to Wanderlust");
         res.redirect("/listings");
     });
   
    }catch(e){
         req.flash("error",e.message);
         res.redirect("/signup");
    }
 }

 module.exports.renderLogin=(req,res) => {
    res.render("users/login.ejs");
}

module.exports.logout=(req,res) => {
    req.logout((err)=>{
        if(err){
           return next(err); 
        }
        req.flash("success","you are logged out !");
        res.redirect("/listings");
    })

}

module.exports.login=async(req,res)=> {
   
    // res.send("Welcome to Wanderlust! You are logged in! ");
     req.flash("success","welcome back to wanderlust");
     let redirectUrl=res.locals.redirectUrl || "/listings";
     res.redirect(redirectUrl);

}