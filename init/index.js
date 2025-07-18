//db connection
const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/Listing.js");
main().then(()=>{
    console.log("connected successfully");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
} 
const initDB=async()=>{
    await Listing.deleteMany({}); 

    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:"681e115c48d91c3f70f579ee",
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};
initDB();
