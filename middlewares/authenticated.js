const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const User = require("../models/User.js")
const isAuthenticated = asyncHandler((async(req, res, next)=>{
    //check if the user is login or not
    if(req.cookies.token){
        //the verify function returns ana object stored in the decoded, this is piece of
        //information encoded with the token 
        //each token here is assigned with an user
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY)
        //add the user to the req object
        req.user = await User.findById(decoded?.id).select("-password")
        return next()
    }
    else{
        return res.json({
            status: "fail"
        })
    }
    

}))

module.exports =  isAuthenticated