const Listing = require("../Models/listing.js");

module.exports.index = async (req, res) => {
    const all_listings = await Listing.find({}); //returns all the file regarding the things
    res.render("listings/index.ejs", { all_listings }); // --> important needs to note it downefficiently
};

module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(url," ",filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs");
};
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested doesn't exist!");
        return res.redirect("/listings"); // Ensure 'return' is here
    }
    res.render("listings/show.ejs", { listing }); // --> important needs to note it downefficiently
};
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested doesn't exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    //const listing=Listing.findByIdAndUpdate(id,{...req.body}); //-->use in case deconstructor
    let { title, description, url, filename, price, country, location } = req.body;
    const listing = await Listing.findByIdAndUpdate(id, {
        title: title,
        description: description,
        image: {
            filename: filename,
            url: url,
        },
        price: price,
        country: country,
        location: location,
    }); //-->use in case deconstructor

    res.redirect("/listings");
};
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    const deleted_listing = await Listing.findByIdAndDelete(id);
    console.log(deleted_listing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};