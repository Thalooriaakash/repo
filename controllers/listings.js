const Listing=require("../models/Listing.js");

//here index is a function ie user define
module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
        res.render("listings/index",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new");
};

module.exports.showListing=async(req,res)=>{
let {id}=req.params; 
const listing=await Listing.findById(id)
.populate({ // nested populate
    path:"reviews",
    populate:{
        path:"author",
         select: 'username'
    },
}).populate("owner");

if(!listing){
    req.flash("error","Listing you requested for does not exist");
    res.redirect("/listings");
}
 
res.render("listings/show",{listing});

};

module.exports.createListing=async(req,res)=>{
   // let (title,description,image,price,country,location)=req.body; // here is the new way of getting the values   

   let url=req.file.path;
   let filename=req.file.filename;
   
   const listingData = req.body.listing;
   const newListing = new Listing(listingData);
   newListing.owner=req.user._id;
   newListing.image={url,filename};
   // Get location from form
    const location = req.body.listing.location;
    // Fetch coordinates from Nominatim
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
    const data = await response.json();

    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      console.log(`Latitude: ${lon}, Longitude: ${lat}`);

      newListing.geometry = {
        type: "Point",
        coordinates: [parseFloat(lon), parseFloat(lat)]  // GeoJSON: [lon, lat] // GeoJSON expects [longitude, latitude]
      };
    } else {
      console.log("Location not found");
    }//end
   let saveListing=await newListing.save();
   console.log(saveListing);
  req.flash("success","New Listing Created");
   res.redirect("/listings",);
};

module.exports.renderEdit=async (req, res) => {
        //console.log("i am in middleware.js"+req.user);

    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit", { listing,originalImageUrl });
};

module.exports.updateListing=async(req,res)=>{
let {id}=req.params;
let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});//updating the values by using ids and individual values

if(typeof req.file!=="undefined"){
let url=req.file.path;
let filename=req.file.filename;
listing.image={url,filename};
await listing.save();
}
req.flash("success","Listing Updated!");
res.redirect("/listings");
};

module.exports.destroylisting=async(req,res)=>{
    let{id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};