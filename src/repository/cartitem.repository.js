const { CartItem } = require('../db/models')

const getCartItemRepository = async (cartId, productId) => {
    console.log("entered to getcartitemrepo")

    return await CartItem.findOne({ where: { cartId, productId } })
}

const getCartItemsRepository = async (cartId) => {
    console.log("entered to getcartitemsrepo")

    return await CartItem.findAll({ where: { cartId } })
}

const createCartItemRepository = async (cartItemData) => {
    console.log("entered to createcartitemrepo")

    return await CartItem.create(cartItemData)
}

const updateCartItemQuantityRepository = async (cartItemId, updatedData) => {
    console.log("entered to updatecartitemquantrepo")

    return await CartItem.update(updatedData, { where: { id: cartItemId } })
}

module.exports = {
    getCartItemRepository,
    createCartItemRepository,
    updateCartItemQuantityRepository,
    getCartItemsRepository
}

