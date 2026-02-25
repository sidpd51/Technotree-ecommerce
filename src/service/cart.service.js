const { createCartRepository, getCartRepository, updateCartTotalAmoutRepository } = require("../repository/cart.repository")
const { getProductRepository } = require("../repository/product.repository")
const { getCartItemRepository, getCartItemsRepository, createCartItemRepository, updateCartItemQuantityRepository } = require("../repository/cartitem.repository")
const {findUserByIdRepository} = require("../repository/user.repository")
const { BadRequestError, NotFoundError, UnprocessableEntityError } = require('../utils/app.error') 


const addToCartService = async (userId, productId) => {
    const user = await findUserByIdRepository(userId)
    if(!user){
        throw new NotFoundError("user not found")
    }
    const product = await getProductRepository(productId)
    if (!product) {
        console.log("product not found")

        throw new NotFoundError("Product not found!")
    }
    if (product.stock <= 0) {
        console.log("entered to stock")

        throw new BadRequestError("Product is out of stock!")
    }
    let cart = await getCartRepository(userId)
    if (!cart) {
        cart = await createCartRepository(userId)
        // console.log("Cart items", cart.countCartItem())
    }
    // return cart

    let cartItem = await getCartItemRepository(cart.id, productId)
    if (cartItem) {
        const newQuantity = cartItem.quantity + 1
        const newPrice = newQuantity * product.price
        if (newQuantity > product.stock) {
            console.log("stock is max")
            throw new UnprocessableEntityError("cannot add more due to limited stock ")
        }
        await updateCartItemQuantityRepository(cartItem.id, { quantity: newQuantity, price: newPrice })
    } else {
        await createCartItemRepository({
            cartId: cart.id,
            productId: product.id,
            quantity: 1,
            price: product.price
        })
    }
    const totalAmount = await calculateTotalAmountService(cart.id)
    await updateCartTotalAmoutRepository(cart.id, totalAmount)
    cart = await getCartRepository(userId)
    return cart
}
const calculateTotalAmountService = async (cartId) => {
    const cartItems = await getCartItemsRepository(cartId)
    let totalAmount = 0
    cartItems.forEach(cartItem => {
        totalAmount = totalAmount + (cartItem.price * cartItem.quantity)
    });
    return totalAmount
}

const getCartService = async (userId) => {
    return await getCartRepository(userId)
}

module.exports = {
    addToCartService,
    getCartService,
    calculateTotalAmountService
}
