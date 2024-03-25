const express = require("express")
const userRoute = express.Router()
const {register, login, logout, userProfile, checkAuth} = require("../controllers/User")
const isAuthenticated = require("../middlewares/authenticated")
const checkApiLimit = require("../middlewares/checkApiLimit")

userRoute.post("/register", register)
userRoute.post("/login", login)
userRoute.post("/logout", logout)
userRoute.get("/user-profile", isAuthenticated, userProfile)
userRoute.get("/auth/check", isAuthenticated, checkAuth)

module.exports = { userRoute }