import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getWalletBalance,
    addFunds,
    withdrawFunds,
    getTransactionHistory
} from "../controllers/wallet.controller.js";

const router = Router();

router.use(verifyJWT);

// Only allow certain user types to access wallet features
router.use((req, res, next) => {
    const allowedTypes = ["Researcher", "Innovator", "Entrepreneur"];
    if (!allowedTypes.includes(req.user.userType)) {
        return res.status(403).json({
            success: false,
            message: "Wallet features not available for this user type"
        });
    }
    next();
});

router.route("/balance").get(getWalletBalance);
router.route("/add").post(addFunds);
router.route("/withdraw").post(withdrawFunds);
router.route("/transactions").get(getTransactionHistory);

export default router; 