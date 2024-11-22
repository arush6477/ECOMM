import { Router } from "express"
const router = Router()

// importing controllers
import {
    addProduct
} from "../controllers/product.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

router.route("/addproduct").post(
    upload.fields([
        {
            name: "mainImage",
            count: 1
        },
        {
            name: "subImages",
            maxCount: 4
        }
    ]),
    addProduct)

export default router