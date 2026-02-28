const { createCartRepository, getCartRepository, updateCartTotalAmountRepository } = require("../repository/cart.repository")
const { getProductRepository, updateProductRepository } = require("../repository/product.repository")
const { getCartItemRepository, getCartItemsRepository, createCartItemRepository, updateCartItemQuantityRepository, deleteCartItemRepository } = require('../repository/cartitem.repository')
const { findUserByIdRepository } = require("../repository/user.repository")
const { NotFoundError, UnprocessableEntityError, BadRequestError } = require('../utils/app.error')

const addToCartService = async (userId, productId) => {
    const user = await findUserByIdRepository(userId)
    if (!user) {
        throw new BadRequestError("user doesn't exist")
    }
    const product = await getProductRepository(productId)
    if (!product) {
        throw new NotFoundError("Product not found!")
    }
    if (product.stock <= 0) {
        throw new UnprocessableEntityError("Product is out of stock!")
    }
    let cart = await getCartRepository(userId)
    if (!cart) {
        cart = await createCartRepository(userId)
    }
    let cartItem = await getCartItemRepository(cart.id, productId)
    if (cartItem) {
        const newQuantity = cartItem.quantity + 1
        const newPrice = product.price
        if (newQuantity > product.stock) {
            throw new UnprocessableEntityError(
                "Cannot add more of this product due to limited stock"
            )
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
    await updateProductRepository(productId, { stock: product.stock - 1 })
    const totalAmount = await calculateTotalAmountService(cart.id)
    await updateCartTotalAmountRepository(cart.id, totalAmount)
    cart = await getCartRepository(userId)
    return cart
}

const removeFromCartService = async (userId, productId) => {
    const user = await findUserByIdRepository(userId)
    if (!user) {
        throw new BadRequestError("user doesn't exist")
    }
    const product = await getProductRepository(productId)
    if (!product) {
        throw new NotFoundError("Product not found!")
    }
    let cart = await getCartRepository(userId)
    if (!cart) {
        throw new BadRequestError("Cart not found!")
    }
    let cartItem = await getCartItemRepository(cart.id, productId)
    if (!cartItem) {
        throw new BadRequestError(`No Cart item associated with this product id :${productId} available!`)
    }
    if (cartItem.quantity > 0) {
        const newQuantity = cartItem.quantity - 1
        const newPrice = product.price
        await updateCartItemQuantityRepository(cartItem.id, { quantity: newQuantity, price: newPrice })
    } else {
        await deleteCartItemRepository(cartItem.id)
        throw new BadRequestError(`No Cart item associated with this product id :${productId} available!`)
    }

    await updateProductRepository(productId, { stock: product.stock + 1 })
    const totalAmount = await calculateTotalAmountService(cart.id)
    await updateCartTotalAmountRepository(cart.id, totalAmount)
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
    removeFromCartService
}
