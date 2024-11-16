import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getWalletBalance,
    addFunds,
    withdrawFunds,
    getTransactionHistory,
    toggleWalletStatus
} from "../controllers/wallet.controller.js";

const router = Router();

// Middleware to verify JWT token
router.use(verifyJWT);

// Middleware to check user type
const checkWalletAccess = (req, res, next) => {
    const allowedTypes = ["Researcher", "Innovator", "Entrepreneur"];
    if (!allowedTypes.includes(req.user?.userType)) {
        return res.status(403).json({
            success: false,
            message: "Wallet features not available for this user type"
        });
    }
    next();
};

// Apply wallet access check to all routes
router.use(checkWalletAccess);

// Wallet routes
router.get("/balance", getWalletBalance);
router.post("/add", addFunds);
router.post("/withdraw", withdrawFunds);
router.get("/transactions", getTransactionHistory);
router.patch("/toggle-status", toggleWalletStatus);

// Error handling middleware
router.use((err, req, res, next) => {
    console.error("Wallet Route Error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Something went wrong in wallet operation"
    });
});

export default router; 