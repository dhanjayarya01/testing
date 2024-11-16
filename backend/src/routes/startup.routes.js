import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    createStartup,
    getStartupById,
    updateStartup,
    deleteStartup,
    getAllStartups,
    getMyStartups
} from "../controllers/startup.controller.js";

const router = Router();

router.use(verifyJWT);

// Create and manage startups
router.post("/create", upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'pitch_deck', maxCount: 1 }
]), createStartup);

router.get("/my-startups", getMyStartups);
router.get("/all", getAllStartups);
router.get("/:id", getStartupById);
router.put("/:id", upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'pitch_deck', maxCount: 1 }
]), updateStartup);
router.delete("/:id", deleteStartup);

export default router; 