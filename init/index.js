const mongoose = require('mongoose');
const initData=require("./data.js");

const Listing = require("../Models/listing.js"); //you nned to check the path 
const { init } = require('../Models/user.js');
//it is not the code  it is the general logic right so take care of these things very nicely

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(mongo_url);
}
main().then((res) => {
    console.log("Connection to DB");
}).catch((err) =>
    console.log(err)
)
const initDB=async ()=>{
    try {
        await Listing.deleteMany({});
        initData.data= initData.data.map((obj)=>({...obj,owner:"699027c423ef31b8f4462f74"}));
        await Listing.insertMany(initData.data);
        console.log("Data was Initialised");
    } catch (initError) {
        console.error("Error initializing the database:", initError);
    }
}
 
initDB();
