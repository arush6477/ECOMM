import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import multer from "multer"
export const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// importing routes
import userRouter from "./routes/user.routes.js"
import productRouter from "./routes/product.route.js"


// declaring routes
app.use("/api/v1/user",userRouter)
app.use("/api/v1/product",productRouter)
// app.use("/api/v1/order",orderRouter)
// app.use("/api/v1/category",categoryRouter)