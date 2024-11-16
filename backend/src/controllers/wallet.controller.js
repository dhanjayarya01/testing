import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Wallet } from "../models/wallet.model.js";

const getWalletBalance = asyncHandler(async (req, res) => {
    const wallet = await Wallet.findOne({ user: req.user._id });
    
    if (!wallet) {
        throw new ApiError(404, "Wallet not found");
    }

    if (!wallet.isActive) {
        throw new ApiError(403, "Wallet is inactive");
    }

    return res.status(200).json(
        new ApiResponse(200, { balance: wallet.balance }, "Wallet balance fetched")
    );
});

const addFunds = asyncHandler(async (req, res) => {
    const { amount, description } = req.body;
    
    if (!amount || amount <= 0) {
        throw new ApiError(400, "Invalid amount");
    }

    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
        throw new ApiError(404, "Wallet not found");
    }

    if (!wallet.isActive) {
        throw new ApiError(403, "Wallet is inactive");
    }

    const reference = `CR-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const updatedWallet = await Wallet.findByIdAndUpdate(
        wallet._id,
        {
            $inc: { balance: amount },
            $push: {
                transactions: {
                    type: 'credit',
                    amount,
                    description: description || 'Funds added',
                    reference,
                    timestamp: new Date()
                }
            }
        },
        { new: true, runValidators: true }
    );

    return res.status(200).json(
        new ApiResponse(200, {
            balance: updatedWallet.balance,
            transaction: updatedWallet.transactions[updatedWallet.transactions.length - 1]
        }, "Funds added successfully")
    );
});

const withdrawFunds = asyncHandler(async (req, res) => {
    const { amount, description } = req.body;
    
    if (!amount || amount <= 0) {
        throw new ApiError(400, "Invalid amount");
    }

    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
        throw new ApiError(404, "Wallet not found");
    }

    if (!wallet.isActive) {
        throw new ApiError(403, "Wallet is inactive");
    }

    if (wallet.balance < amount) {
        throw new ApiError(400, "Insufficient funds");
    }

    const reference = `DB-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const updatedWallet = await Wallet.findByIdAndUpdate(
        wallet._id,
        {
            $inc: { balance: -amount },
            $push: {
                transactions: {
                    type: 'debit',
                    amount,
                    description: description || 'Funds withdrawn',
                    reference,
                    timestamp: new Date()
                }
            }
        },
        { new: true, runValidators: true }
    );

    return res.status(200).json(
        new ApiResponse(200, {
            balance: updatedWallet.balance,
            transaction: updatedWallet.transactions[updatedWallet.transactions.length - 1]
        }, "Funds withdrawn successfully")
    );
});

const getTransactionHistory = asyncHandler(async (req, res) => {
    const wallet = await Wallet.findOne({ user: req.user._id })
        .select('transactions');
    
    if (!wallet) {
        throw new ApiError(404, "Wallet not found");
    }

    if (!wallet.isActive) {
        throw new ApiError(403, "Wallet is inactive");
    }

    return res.status(200).json(
        new ApiResponse(200, { 
            transactions: wallet.transactions 
        }, "Transaction history fetched")
    );
});

const toggleWalletStatus = asyncHandler(async (req, res) => {
    const wallet = await Wallet.findOne({ user: req.user._id });
    
    if (!wallet) {
        throw new ApiError(404, "Wallet not found");
    }

    wallet.isActive = !wallet.isActive;
    await wallet.save();

    return res.status(200).json(
        new ApiResponse(200, { 
            isActive: wallet.isActive 
        }, `Wallet ${wallet.isActive ? 'activated' : 'deactivated'} successfully`)
    );
});

export {
    getWalletBalance,
    addFunds,
    withdrawFunds,
    getTransactionHistory,
    toggleWalletStatus
}; 