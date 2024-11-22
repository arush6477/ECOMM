import { Router } from "express"
import { 
    getOTP,
    loginUser, 
    registerUser, 
    verifyEmail
} from "../controllers/user.controller.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/verify-mail/:userId/otp/:otp").patch(verifyEmail)
router.route("/getotp/:email").patch(getOTP)

export default router