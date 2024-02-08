module.exports.isLoggedIn=(req,res,next) =>{
     console.log(req.path,"..",req.originalUrl)
    if (req.user === undefined || !req.isAuthenticated()) {
        //for finding redirect url
        //here below we have session object in req object and we are creating redirectUrl to store the originalUrl
        req.session.redirectUrl= req.originalUrl;
        req.flash("error", "You must be logged in to create a listing!");
        return res.redirect("/login");
    }
    next();
};
//passport does not have access to delete local variables
module.exports.saveRedirectUrl=(req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        console.log(res.locals.redirectUrl);

    }
    next();
};





