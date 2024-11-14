import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const getWalletBalance = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.hasWalletAccess()) {
        throw new ApiError(403, "Wallet feature is only available for Researchers and Innovators");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user.profileDetails.wallet, "Wallet details fetched successfully"));
});

const addFunds = asyncHandler(async (req, res) => {
    const { amount, description } = req.body;
    
    if (!amount || amount <= 0) {
        throw new ApiError(400, "Invalid amount");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.hasWalletAccess()) {
        throw new ApiError(403, "Wallet feature is only available for Researchers and Innovators");
    }

    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
            $inc: { "profileDetails.wallet.balance": amount },
            $push: {
                "profileDetails.wallet.transactions": {
                    type: 'credit',
                    amount,
                    description: description || 'Funds added',
                    timestamp: new Date()
                }
            }
        },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(
            200, 
            updatedUser.profileDetails.wallet, 
            "Funds added successfully"
        ));
});

const withdrawFunds = asyncHandler(async (req, res) => {
    const { amount, description } = req.body;
    
    if (!amount || amount <= 0) {
        throw new ApiError(400, "Invalid amount");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.hasWalletAccess()) {
        throw new ApiError(403, "Wallet feature is only available for Researchers and Innovators");
    }

    if (user.profileDetails.wallet.balance < amount) {
        throw new ApiError(400, "Insufficient funds");
    }

    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
            $inc: { "profileDetails.wallet.balance": -amount },
            $push: {
                "profileDetails.wallet.transactions": {
                    type: 'debit',
                    amount,
                    description: description || 'Funds withdrawn',
                    timestamp: new Date()
                }
            }
        },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(
            200, 
            updatedUser.profileDetails.wallet, 
            "Funds withdrawn successfully"
        ));
});

const getTransactionHistory = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.hasWalletAccess()) {
        throw new ApiError(403, "Wallet feature is only available for Researchers and Innovators");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200, 
            user.profileDetails.wallet.transactions, 
            "Transaction history fetched successfully"
        ));
});

export {
    getWalletBalance,
    addFunds,
    withdrawFunds,
    getTransactionHistory
}; 