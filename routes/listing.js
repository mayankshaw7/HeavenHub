const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../util/wrapAsync.js");
const Listing = require("../Models/listing.js");
const { isLoggedIn, isOwner, Validate_listing } = require("../middleware.js");
const listingController = require("../Controller/listings.js");
const { storage } = require("../Cloudconfig.js");
const multer = require('multer')
//This is for Temporary later we may can change the things
//as per the Cloud system like AWS, render etc.
const upload = multer({ storage })

//Validation Error function  for listings

//get the listing of the things
//INDEX ROUTE
// router.get("/",wrapAsync(listingController.index)); 

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("listing[image][url]"),Validate_listing, wrapAsync(listingController.createListing));
    // .post(upload.single('listing[image][url]'), (req, res) => {
    //     res.send(req.file);
    // });
//.send(req.body);
// New route 
//order is very important since you are also throwing :id and new
//as per the rule of express it is taking new as id if written after the show.ejs

router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

//Edit route
router.get("/:id/edit", isLoggedIn, isOwner,
    wrapAsync(listingController.renderEditForm));
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, wrapAsync(listingController.deleteListing));

module.exports = router;
//show route
// router.get("/:id",
//     wrapAsync(listingController.showListing));
//Create  Route
//passing validate listing as a middleware
// router.post("/", isLoggedIn,
//     Validate_listing,
//     wrapAsync(listingController.createListing));


//update route
// router.put("/:id", isLoggedIn,
//     wrapAsync(listingController.updateListing));


// for deleting the listings
// router.delete("/:id", isLoggedIn,
//     wrapAsync(listingController.deleteListing));
