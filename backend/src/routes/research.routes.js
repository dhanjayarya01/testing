import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    createResearch,
    getResearchById,
    updateResearch,
    deleteResearch,
    getAllResearch,
    getMyResearch
} from "../controllers/research.controller.js";

const router = Router();

router.use(verifyJWT);

// Create and manage research
router.post("/create", upload.fields([
    { name: 'paper', maxCount: 1 },
    { name: 'supporting_documents', maxCount: 5 }
]), createResearch);

router.get("/my-research", getMyResearch);
router.get("/all", getAllResearch);
router.get("/:id", getResearchById);
router.put("/:id", upload.fields([
    { name: 'paper', maxCount: 1 },
    { name: 'supporting_documents', maxCount: 5 }
]), updateResearch);
router.delete("/:id", deleteResearch);

export default router; 