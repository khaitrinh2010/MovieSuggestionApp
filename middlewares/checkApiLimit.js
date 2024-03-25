const User = require("../models/User")
const checkApiLimit = async(req, res, next) =>{
    if(!req.user){
        return res.json({message: "You are not authorized"})
    }
    const userFound = await User.findById(req?.user?._id)
    if(!userFound){
        return res.json({message: "User not Found"})
    }
    if(userFound.apiRequestCount > userFound.monthlyRequuestCount){
        return res.json({message: "Limit reached"})
    }
    next()
    
}
module.exports = checkApiLimit