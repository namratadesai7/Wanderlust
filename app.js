if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}
require('dotenv').config();  // to access envIORNMENT variables
console.log(process.env.SECRET);

const express= require("express");
const app=express();
const mongoose= require('mongoose');
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");   //helps in creating templates/layers 
const ExpressError =require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore=require('connect-mongo'); //above express session can be used only on devlopment level now at production level we need connectmongo to store variable in session
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl= process.env.ATLASDB_URL;
main().then(() => {
    console.log("connected to DB")
})
.catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); //to parse all the data
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store= MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error", () =>{
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

// app.get("/",(req,res) => {
//     res.send("Hi,I am root");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{  //middleware for listing and review routes for sending success and error
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser=req.user;
   
 
    next();
})

// app.get("/demouser",async(req,res) =>{
//     let fakeUser= new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });

//     let registeredUser=await User.register(fakeUser,"helloworld"); 
//     res.send(registeredUser);
// })

//after shiftings all the apis from below to routes folder i have to write below line
app.use("/listings",listingRouter);

//do the same with Review 
app.use("/listings/:id/reviews",reviewRouter); // here the id stays in the parent route in app.js and is not passed to child route in review
                                            //we can use merge params to pass it to the child route also
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

app.use("/",userRouter); 

app.all("*",(req,res,next) =>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next) =>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.render("error.ejs",{message});
    //res.status(statusCode).send(message);
});

app.listen(5600,() =>{
     console.log("Server is listening to port 5600");
});