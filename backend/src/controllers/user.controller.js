import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        
        if (!user) {
            throw new Error("User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        console.error("Token Generation Error:", error);
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}

const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            userType,
            organizationName,
            profileDetails
        } = req.body;

        // Basic validation
        if ([name, email, password, userType].some((field) => !field?.trim())) {
            return res.status(400).json({ 
                success: false,
                message: "All required fields must be filled" 
            });
        }

        // Create user with provided profile details
        const user = await User.create({
            name,
            email,
            password,
            userType,
            organizationName,
            profileDetails: {
                ...profileDetails,
               
                fundingStagePreference: profileDetails.fundingStagePreference || "",
                
                focusAreas: Array.isArray(profileDetails.focusAreas) ? profileDetails.focusAreas : [],
                
                investmentCapacityRange: profileDetails.investmentCapacityRange || ""
            }
        });

        const accessToken = user.generateAccessToken();

       
        const createdUser = user.toObject();
        delete createdUser.password;

        return res.status(201).json({
            success: true,
            user: createdUser,
            accessToken
        });

    } catch (error) {
        console.error("REGISTER ERROR: ", error);
        return res.status(500).json({
            success: false,
            message: "Error during registration"
        });
    }
}

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            throw new ApiError(400, "Email is required");
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(404, "User does not exist");
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid credentials");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        // Update cookie options
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: 'Lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000 
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true,
                message: "User logged in successfully",
                data: {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                }
            });
    } catch (error) {
        throw new ApiError(500, error?.message || "Login failed");
    }
});

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
} 