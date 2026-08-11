if (process.env.NODE_ENV != "production") {
    require('dotenv').config() // or import 'dotenv/config' if you're using ES6
}
//we are doing this as then when it is in development phase untill that time we will use
//otherwise we are not going to use it 
console.log(process.env.secret) // remove this after you've confirmed it is working

const express = require("express");
const mongoose = require('mongoose');
const Listing = require("./Models/listing.js");
const Review = require("./Models/reviews.js");
const User = require("./Models/user.js");
const wrapAsync = require("./util/wrapAsync.js");
const ExpressError = require("./util/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
//requirng all the routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const methodOverride = require("method-override");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
//for ejs
const ejsMate = require("ejs-mate");
const app = express();
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
//in future we can more session options there
// Adding Cookie Options
const sessionOptions = {
    secret: "mysecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    },
};
app.use(session(sessionOptions));
app.use(flash());

// ADD THESE TWO LINES HERE:
app.use(passport.initialize()); //
app.use(passport.session());    //
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//joining the path
// Set EJS as the templating engine
app.set('view engine', 'ejs');
// Specify the views directory if it's not the default 'views'
app.set('views', path.join(__dirname, 'views'));
//use for parsing from the req.body
// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

let port = 8080;
app.listen(port, () => {
    console.log(`Server is listening on the port ${port}`);
});

//middle ware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error"); // Good practice to include error too
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
//root

app.get("/", (req, res) => {
    res.send("Hi i am root");
});

//jab bhi ye route the call ayega toh idhar forward ho jayega


async function main() {
    await mongoose.connect(mongo_url);
}
main().then((res) => {
    console.log("Connection to DB");
}).catch((err) =>
    console.log(err)
)
//test listing
app.get("/testlisting", async (req, res) => {
    try {
        let sampleListing = new Listing({
            title: "My new Villa",
            description: "By the Beach",
            price: 1200,
            location: "Calanguate Goa",
            country: "India",
        });
        await sampleListing.save();
        console.log("Sample was saved");
        res.send("Successful Testing");
    }
    catch (saveError) {
        console.error("Error saving listing:", saveError);
        res.status(500).send("Error saving the listing");
        // Return a 500 error if save fails
    }
});


//created Error handler for all pages
app.all('*path', (req, res, next) => {
    next(new ExpressError(404, "Page not Found"));
});

//custom error handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
});


/*
//saving new file using post
app.post("/listings", async (req, res) => {
    try {
        let { title, description, url, filename, price, country, location } = req.body;
        const newListing = new Listing({
            title: title,
            description: description,
            image: {
                filename: filename,
                url: url,
            },
            price: price,
            country: country,
            location: location,
        });
        console.log(newListing);
        await newListing.save();
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
});
*/

//saving new file using post
/*
app.post("/listings",
    wrapAsync(async (req, res) => {

        let { title, description, url, filename, price, country, location } = req.body;
        const newListing = new Listing({
            title: title,
            description: description,
            image: {
                filename: filename,
                url: url,
            },
            price: price,
            country: country,
            location: location,
        });
        if(!req.body.title){
            throw new ExpressError(400,"Send Valid Data For the Listing");
        }
        console.log(newListing);
        await newListing.save();
        res.redirect("/listings");
})
);
*/
// try {
//     await newListing.save();
//     res.redirect("/listings"); // Redirect to the listings page after saving
// } catch (error) {
//     console.error(error); // Log any errors that occur
//     res.status(400).send('Error creating listing: ' + error.message); // Send error response
// }
// res.redirect("/listings");


// app.post("/listings", async (req, res) => {
//     //here json file having the listing object it itselt that is why printing the list from here onwards
//     let newListing = new Listing(req.body);
//     console.log(req.body);
//     try {
//         await newListing.save();
//         res.redirect("/listings"); // Redirect to the listings page after saving
//     } catch (error) {
//         console.error(error); // Log any errors that occur
//         res.status(400).send('Error creating listing: ' + error.message); // Send error response
//     }
// });

