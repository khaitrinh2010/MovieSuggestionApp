const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
//registration
//login
//logout
//check authentication

//1> register
const register = async(req, res)=>{
    const {username, email, password} = req.body
    try{
        if(!username || !email || !password){
            return res.json({status: "Fail", message: "All fields are required"})
        }
        const userFound = await User.findOne({email}) //find by email
        if(userFound){
            return res.json({status: "Fail", message: "User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)   //hash the password
        const newUser = await User.create({
            username, email, password: hashedPassword
        })

        //will expire 3 days from now, trialExpires is the time the trial becomes expire
        newUser.trialExpires = new Date(new Date().getTime() + newUser.trialPeriod * 24 * 60 * 60* 1000)
        await newUser.save()
        return res.json({
            status: "Success",
            message: "user registered successfully"
        })
    }
    catch(error){
        console.error("Registration Error: ", error);
        res.status(500).json({status: "Failed", message: "Server error", error: error.message});
    }
    
}

const login = async(req, res) => {
    const {email, password} = req.body
    const userFound = await User.findOne({email})
    if(!userFound){
        return res.json({status: "fail", messagae: "No user found"})
    }
    const isUser = await bcrypt.compare(password, userFound.password)
    if(!isUser){
        return res.json({status: "fail", messagae: "Invalid Login Credentials"})
    }
    //generate a token with the key
    const token = jwt.sign({id: userFound?._id}, process.env.JWT_KEY, {
        expiresIn: "3d"
    })
    res.cookie("token", token, {  //now there is an object token with the key token inside the cookie
        httpOnly: true,
        samesite: "strict",
        maxAge: 3*24*24*60*1000
    })
 //3days    })
    return res.json({status: "Success", message: "Login successfully"})
}

const logout = async(req, res)=>{
    res.cookie("token", "", {maxAge: 1})   //tell the browser to expire the token
    return res.json({
        status: "Success",
        messgae: "Log out successfully"
    })
}

const userProfile = async(req, res)=>{
    const id = req?.user?._id
    const user = await User.findById(id)
    if(user){
        return res.json({status: "success", user: user})
    }
    return res.json({status: "fail"})
}

const checkAuth = async(req, res)=>{
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY)
    console.log(decoded)
    if(decoded){
        return res.json({
            status: true
        })
    }
    else{
        return res.json({
            status: false
        })
    }
}

module.exports = {register, login, logout, userProfile, checkAuth}