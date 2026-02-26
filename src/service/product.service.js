const { createProductRepository, getProductByNameRepository, getAllProductsRepository, getProductRepository, updateProductRepository, deleteProductRepository } = require('../repository/product.repository')
const { BadRequestError, NotFoundError } = require('../utils/app.error')

const createProductService = async (product) => {
    const productExist = await getProductByNameRepository(product.name)
    if (productExist) {
        console.log("Product already exists")
        throw new BadRequestError("Product already exists")
    }
    const newProduct = await createProductRepository(product)
    return newProduct
}

const getAllProductsService = async () => {
    const products = await getAllProductsRepository()
    return products
}

const getProductService = async (id) => {
    const products = await getProductRepository(id)
    if (!products) {
        console.log("Product not found")
        throw new NotFoundError("Product not found")
    }
    return products
}

const updateProductService = async (id,product) =>{
    const productExist = await getProductRepository(id)
    if(!productExist) {
        console.log("Product doesn't exist")
        throw new NotFoundError("Product doesn't exist")
    }
    const updatedProduct = await updateProductRepository(id,product)
    if (updatedProduct[0] === 1) return true
    return false
}

const deleteProductService = async (id) => {
    const product = await getProductRepository(id);
    if(!product){
        console.log("Product not found")
        throw new NotFoundError("Product not found");
    }
    const deletedproduct = await deleteProductRepository(id);
    if (deletedproduct) return true
    return false
}

module.exports = {
    createProductService,
    getAllProductsService,
    getProductService,
    updateProductService,
    deleteProductService
}