import nodemailer from "nodemailer"
import speakeasy from "speakeasy"
import mongoose from "mongoose"

const otpSchema = new mongoose.Schema({
    identifier: { 
        type: String, 
        required: true 
    }, // Email or phone
    otp: { 
        type: String, 
        required: true 
    },
    expiresAt: { 
        type: Date, 
        required: true, 
        index: { 
            expires: 0 
        } 
    }, // TTL index
})

const OTP = mongoose.model("OTP", otpSchema);


const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: process.env.EMAIL_USER || "invalidhacked@gmail.com",
        pass: process.env.EMAIL_PASS || "gsob jfor pjxh tsju",
    },
})

const sendMailOTP = async (email) => {

    const otp = speakeasy.totp({ secret: process.env.OTP_SECRET, encoding: 'base32' });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
    }

    try {
        await transporter.sendMail(mailOptions)
        const otpEntry = new OTP({ identifier: email, otp: otp, expiresAt: new Date(Date.now() + 1 * 60 * 1000) })
        await otpEntry.save()
        return true
    } catch (error) {
        console.log("Failed to send the OTP. The error is: ", error)
        return error
    }
}

const verifyMailOTP = async (identifier,otp) =>{
    const otpEntry = await OTP.findOne({identifier: identifier})
    if(!otpEntry) return false;

    if (otpEntry.expiresAt < new Date()) {
        await OTP.deleteOne({ identifier: email }); // Cleanup expired OTP
        return false
    }

    if (otpEntry.otp === otp) {
        await OTP.deleteOne({ identifier: email })
        return true
    }
}

export{
    sendMailOTP,
    verifyMailOTP
}