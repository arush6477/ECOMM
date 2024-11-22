import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { sendMailOTP, verifyMailOTP } from "../utils/mail.js"

const generateAcceessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken(user._id)
        const refreshToken = user.generateRefreshToken(user._id)

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, error);
    }

}

const cookieOptions = {
    httponly: true,
    secure: true
}

const registerUser = asyncHandler(async (req, res) => {
    const { name, username, email, password } = req.body

    if (!name || !username || !email || !password) throw new ApiError(401, "incomplete data");

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) throw new ApiError(401, "user with same username or email alredy exist");

    const registerDatabase = await User.create({
        name: name,
        username: username,
        email: email,
        password: password
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                registerDatabase,
                "user registered successfully"
        ))
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) throw new ApiError(401, "username or password missing");

    const user = await User.findOne({
        $or: [{ username }]
    })

    if (!user) throw new ApiError(401, "user does not exist");

    const isPassCorrect = await user.isPasswordCorrect(password)

    if (!isPassCorrect) throw new ApiError(401, "invalid password");

    const { accessToken, refreshToken } = await generateAcceessAndRefreshToken(user._id)

    const loggedInUser = User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    anurag: "SADA BHAI"
                },
                "User logged In Successfully"
            )
        )
})

const getOTP = asyncHandler(async (req,res) => {
    const {email} = req.params
    if(!email) throw new ApiError(400,"please provide the email in the params");

    const sendOTP = await sendMailOTP(email)
    if(!sendOTP) throw new ApiError(500,`Failed to send the OTP`);

    return res.status(200).json(new ApiResponse(200,{},"OTP sent successfully"))
})

const verifyOTP = asyncHandler(async (req,res)=>{
    const {identifier,OTP} = req.params
    if(!identifier || !OTP) throw new ApiError(401,"incomplete request");

    const verifyOTP = verifyMailOTP(identifier,OTP)
    if(!verifyOTP){
        return res.status(401,{},"OTP is wrong or expired")
    }

    return res.status(200).json(new ApiResponse(200,{},"OTP is verified"))
})

/*
    to verify the EMAIL first req for OTP from getotp endpoint 
    then req to verify email to verify the otp for email
*/
const verifyEmail = asyncHandler(async (req,res) => {
    const {userId, OTP} = req.params
    if(!userId) throw new ApiError(400,"user id is missing");

    const connectDatabase = await User.findById(userId)
    if(!connectDatabase) throw new ApiError(401,"user does not exist");

   const verifyOTP = await verifyMailOTP(connectDatabase.email, OTP)

    if(!verifyOTP) throw new ApiError(401,"OTP is incorrect or expired");

    connectDatabase.isEmailVerified = "verified"
    await connectDatabase.save()
    
    return res.status(200).json(new ApiResponse(200,connectDatabase,"Email is verified successfully"))
})

export {
    registerUser,
    loginUser,
    getOTP,
    verifyOTP,
    verifyEmail
}
