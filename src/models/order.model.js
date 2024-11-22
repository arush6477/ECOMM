import mongoose from "mongoose"

const orderStatusEnum = {
    PENDING : "PENDING",
    CANCELLED : "CANCELLED",
    DELIVERED : "DELIVERED"
}

const AvailableOrderStatuses = Object.values(orderStatusEnum)

const orderSchema = new mongoose.model({
    orderPrice : {
        type : Number,
        required : true
    },
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    items: {
        type: [
          {
            productId: {
              type: Schema.Types.ObjectId,
              ref: "Product",
            },
            quantity: {
              type: Number,
              required: true,
              min: [1, "Quantity can not be less then 1."],
              default: 1,
            },
          },
        ],
        default: [],
      },
      address: {
        addressLine1: {
          required: true,
          type: String,
        },
        addressLine2: {
          type: String,
        },
        city: {
          required: true,
          type: String,
        },
        country: {
          required: true,
          type: String,
        },
        pincode: {
          required: true,
          type: String,
        },
        state: {
          required: true,
          type: String,
        },
      },
      status: {
        type: String,
        enum: AvailableOrderStatuses,
        default: orderStatusEnum.PENDING,
      },
    //   paymentProvider: {
    //     type: String,
    //     enum: AvailablePaymentProviders,
    //     default: PaymentProviderEnum.UNKNOWN,
    //   },
    //   paymentId: {
    //     type: String,
    //   },
    //   // This field shows if the payment is done or not
    //   isPaymentDone: {
    //     type: Boolean,
    //     default: false,
    //   },
},{timestamps : true})

export const Order = mongoose.model("Order", orderSchema) 