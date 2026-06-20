require("dotenv").config();
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    })

async function main() { 
  await mongoose.connect(MONGO_URL);

}

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);




app.get("/", (req,res) => {
    res.send("I am root")
});

//Index Route - to show all listings
app.get("/listings", async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
});

//New Route
app.get("/listings/new", async (req ,res) => {
    res.render("listings/new.ejs",);
});

//Submit Route
app.post("/listings",async(req,res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//Show Route - to show details of a particular listing
app.get("/listings/:id",async (req,res) =>{
     let{id} =req.params;
     const listing= await Listing.findById(id);
 

     res.render("listings/show.ejs",{listing})
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async (req,res) => {
    
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});


//Delete Route
app.delete("/listings/:id", async(req,res) =>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");

}); 

app.use((req,res) => {
    res.status(404).send("Page not found");
});

// app.listen(8080, (req, res) => {
//     console.log("Server is running on port 8080");
// });

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
