const express = require("express")
const cartRouter = express.Router()
const { addToCartController, removeFromCartController } = require("../../controller/cart.controller")

cartRouter.post('/add', addToCartController)
cartRouter.post('/remove', removeFromCartController)

module.exports = cartRouter
