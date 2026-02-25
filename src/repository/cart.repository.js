const { where } = require("sequelize")
const { Cart } = require("../db/models")

const getCartRepository = async (userId) => {
    console.log("entered to getcartrepo")
    return await Cart.findOne({ where: { userId } })
}
const createCartRepository = async (userId) => {
    console.log("entered to createcartrepo")

    return await Cart.create({ userId, totalAmount: 0 })
}
const updateCartTotalAmoutRepository = async (cartId, totalAmount) => {
    console.log("entered to updateCartTotalAmountRepository")

    return await Cart.update({ totalAmount }, { where: { id: cartId } })
}

// const updateCartTotalAmountRepository = async (cartId, totalAmount) => {
//     return await Cart.update({ totalAmount }, { where: { id: cartId } })
// }


module.exports = {
    getCartRepository,
    createCartRepository,
    updateCartTotalAmoutRepository
}