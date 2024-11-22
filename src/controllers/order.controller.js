import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"

const createOrder = asyncHandler(async (req,res) => {
    const {price, customer, items} = req.body
})

export {
    createOrder
}