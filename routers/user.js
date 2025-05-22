const express=require("express");
const  router=express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const User=require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");

const userController=require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login").get(userController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local",
    {failureRedirect:"/login",
    failureFlash:true}),// it authenticates and if in case any error redirect to the /login and diaplays flash message this done by using  passport as middle
    userController.login
);
router.get("/logout",userController.logout);


module.exports=router;