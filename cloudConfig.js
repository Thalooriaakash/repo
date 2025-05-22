//Multer Storage Cloudinary installation
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// we are connecting ourbackend with cloudinary
cloudinary.config({
cloud_name:process.env.CLOUD_NAME,
api_key:process.env.CLOUD_API_KEY,
api_secret:process.env.CLOUD_API_SECRET
});
//This code creates a storage engine using  CloudinaryStorage, which 
// integrates Multer (a middleware for file uploads) with Cloudinary (a cloud-based image and video storage service).
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowerdFormats: ["png","jpg","jpeg"]
  },
});
module.exports={
    cloudinary,
    storage
}