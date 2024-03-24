const express = require("express")
const userRoute = express.Router()
const {register, login, logout, userProfile} = require("../controllers/User")
const isAuthenticated = require("../middlewares/authenticated")

userRoute.post("/register", register)
userRoute.post("/login", login)
userRoute.post("/logout", logout)
userRoute.get("/user-profile", isAuthenticated, userProfile)

module.exports = { userRoute }