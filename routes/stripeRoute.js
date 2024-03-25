const express = require("express")
const stripeRoute = express.Router()
const isAuthenticated = require("../middlewares/authenticated")
const {handle, handleFree, verifyPayment} = require("../controllers/handleStripePayment")
stripeRoute.post("/checkout", isAuthenticated, handle)
stripeRoute.post("/free-plan", isAuthenticated, handleFree)
stripeRoute.post("/verify-payment/:paymentID", isAuthenticated, verifyPayment)
module.exports = { stripeRoute }