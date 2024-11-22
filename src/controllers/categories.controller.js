import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import Category from "../models/categories.model.js"

// i should also verify that the user requesting is admin or not or else 
// this way a normal user can change and create categories

// create
const addCategory = asyncHandler(async (req, res) => {
    const { categoryName } = req.body
    if (!categoryName) throw new ApiError(400, "provide categoryName in the request");

    const createDatabase = await Category.create({
        name: categoryName
    })
    if (!createDatabase) throw new ApiError(500, "Failed to do create database");

    return res.status(200).json(new ApiError(200, createDatabase, "category created successfully"))
})

// read
const getCategory = asyncHandler(async (req, res) => {

})

// update
const updateCategory = asyncHandler(async (req, res) => {
    const { categoryId, newName } = req.params
    if(!categoryId) throw new ApiError(400,"please provide categoryId");

    const categoryExist = await Category.findById(categoryId)
    if(!categoryExist) throw new ApiError(401,"category does not exist");

    categoryExist.name = newName
    await categoryExist.save()

    return res.status(200).json(new ApiResponse(200,categoryExist,"category updated successfully"))
})

// delete
const deleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params
    if(!categoryId) throw new ApiError(400,"please provide categoryId");

    const categoryExist = await Category.findById(categoryId)
    if(!categoryExist) throw new ApiError(401,"category does not exist");

    const deleteDatabase = await Category.findByIdAndDelete(categoryId)
    if(!deleteDatabase) throw new ApiError(500,"failed to delete the category");

    return res.status(200).json(200,{},"category deleted successfully")
})

export {
    addCategory,
    getCategory,
    updateCategory,
    deleteCategory
}