const express=require("express");
const  router=express.Router();
const review=require("./review.js");
const wrapAsync =require("../utils/wrapAsync.js");
const Listing=require("../models/Listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const listingController=require("../controllers/listings.js");
// use to parse the form of files
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const { listingSchema } = require("../schema.js");
//multer stores the files in cloudinary
const upload = multer({ storage });

router.route("/")
//Index route 
//wrapAsync is used for error handling for asynchronous route handlers.
.get(wrapAsync(listingController.index))

// Create Route
.post(isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing));
   

router.post("/destinations",async(req,res)=>{
    const allListings=await Listing.find({country:req.body.Location });
    if (allListings.length === 0) {
            req.flash("error", "Destination you requested does not exist");
            return res.redirect("/listings"); // Optional: redirect if no results
        }
    res.render("listings/index",{allListings});
});


//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
//show Route
.get(wrapAsync(listingController.showListing))
// update Route
// here we are passing validateListing as a middleware 
.put(isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))
//Delete Route
.delete(isLoggedIn,isOwner,listingController.destroylisting);
module.exports=router;




// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEdit));



