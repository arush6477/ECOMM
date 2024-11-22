import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { Product } from "../models/product.model.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"


// create
const addProduct = asyncHandler(async (req, res) => {
    const { productName, description, price, owner, stock, category } = req.body
    console.log(req.body)

    if (!productName || !description || !price || !owner || !stock || !category) throw new ApiError(401, "incomplete request");

    const categoryExist = await category.findById(category)
    if (!categoryExist) throw new ApiError(404, "category does not exist");

    const mainImageLocalPath = req.files?.mainImage[0]?.path
    if (!mainImageLocalPath) throw new ApiError(401, "product image not found in the description");

    const uploadCloudinary = await uploadOnCloudinary(mainImageLocalPath);
    if (!uploadCloudinary) throw new ApiError(50, "Failed to upload the image");

    // Handle subimages
    const subImagesLocalPaths = req.files?.subImages?.map((file) => file.path) || [];
    if (subImagesLocalPaths.length === 0) throw new ApiError(401, "Subimages not found in the request");

    // Upload subimages to Cloudinary
    const subImagesUrls = []
    for (const subImagePath of subImagesLocalPaths) {
        const subImageUrl = await uploadOnCloudinary(subImagePath);
        subImagesUrls.push(subImageUrl);
    }

    const createDatabase = await Product.create({
        productName: productName,
        mainImage: uploadCloudinary.url,
        subImages: subImagesUrls,
        description: description,
        owner: "66d01dd19cc7e18add59dd3f",
        price: price,
        stock: stock
    })

    if (!createDatabase) throw new ApiError(500, "Failed to add the product");

    return res.status(200).json(new ApiResponse(200, createDatabase, "product created successfully"))
})

// read
const getAllProducts = asyncHandler(async (req, res) => {

})

// update will be a series of functions

// delete
const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params
    if (!productId) throw new ApiError(401, "please provide the productId");

    const deleteDatabase = await Product.findByIdAndDelete(productId)
    if (!deleteDatabase) throw new ApiError(401, "Failed to delete from the database");

    //delete imaages from cloudinary from
    const deleteCloudinary = deleteFromCloudinary(deleteDatabase.mainImage)
    if (deleteCloudinary.subImages) {
        for (const subImages in deleteDatabase.subImages) {
            deleteFromCloudinary(subImages)
        }
    }

    return res.status(200).json(new ApiResponse(200, {}, "product deleted successfully"))
})

export {
    addProduct,// create
    getAllProducts,// read
    // update functions
    deleteProduct // delete
}