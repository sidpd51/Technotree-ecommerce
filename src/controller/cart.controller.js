const { addToCartService } = require("../service/cart.service")
const { StatusCodes } = require("http-status-codes");

const addToCartController = async (req, res) => {
    const { userId, productId } = req.body;
    const cartData = await addToCartService(userId, productId)
    res.status(StatusCodes.OK).json({ message: "Product added to cart successfully", cartData })
}

const removeFromCartController = async (req, res) => {
    const { userId, productId } = req.body;
    const cartData = await removeFromCartService(userId, productId)
    res.status(StatusCodes.OK).json({ message: "Product removed from cart successfully", cartData })
}

module.exports = {
    addToCartController,
    removeFromCartController
}