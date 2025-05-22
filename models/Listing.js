// to have a default image we are creating this page and we are creating schema
const mongoose =require("mongoose");
const schema=mongoose.Schema;
const Review=require("./review.js");
const User=require("./user.js");
const { required } = require("joi");
const listingSchema=new schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:schema.Types.ObjectId,
        ref:"User"
    },
    // using GeoJSON formate
    geometry:{
        type:{
         type:String,
         enum:['Point'],
         required:true
        },
    coordinates:{
        type:[Number],
        required:true
    }
 }

});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});
module.exports=mongoose.model("Listing",listingSchema);