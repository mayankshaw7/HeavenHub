const mongoose = require("mongoose");
// const { listingSchema } = require("../schema");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const Listing_Schema = new Schema({
    title: {
        type: String,
    },
    description: String,
    image: {
        filename: String, //deault is set for the system if not even entered the value in the database
        // default:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        url: String,
        // set: (v) => v === "" ? "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
        //using ternary operator for allocating the link this is set for the frontend information
    },
    price: Number,
    location: String,
    country: String,
    reviews: [ //this array will store all the review of particul listing
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

Listing_Schema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});
const Listing = mongoose.model("Listing", Listing_Schema);
module.exports = Listing; //-->vvery very important i made mistake here only
