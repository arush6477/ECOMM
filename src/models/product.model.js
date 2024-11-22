import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    productName : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    mainImage : {
        type : String,
        required : true
    },
    subImages : [{
        type : {
            url : String,
            localPath : String
        },
        required: true
    }
    ],
    price : {
        type : Number,
        required : true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    stock : {
        type : Number,
        required : true
    }
},{timestamps:true})

export const Product = mongoose.model("Product",productSchema)