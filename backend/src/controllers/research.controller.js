import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Research } from "../models/research.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createResearch = asyncHandler(async (req, res) => {
    const {
        title,
        abstract,
        field,
        status,
        keywords,
        collaborators
    } = req.body;

    if (!title || !abstract || !field) {
        throw new ApiError(400, "All required fields must be filled");
    }

    let paperUrl;
    let supportingDocs = [];

    if (req.files?.paper) {
        const paperFile = await uploadOnCloudinary(req.files.paper[0].path);
        if (paperFile) {
            paperUrl = {
                public_id: paperFile.public_id,
                url: paperFile.secure_url
            };
        }
    }

    if (req.files?.supporting_documents) {
        for (const doc of req.files.supporting_documents) {
            const uploadedDoc = await uploadOnCloudinary(doc.path);
            if (uploadedDoc) {
                supportingDocs.push({
                    public_id: uploadedDoc.public_id,
                    url: uploadedDoc.secure_url,
                    name: doc.originalname
                });
            }
        }
    }

    const research = await Research.create({
        title,
        researcher: req.user._id,
        abstract,
        field,
        status,
        paper: paperUrl,
        supporting_documents: supportingDocs,
        keywords: keywords ? JSON.parse(keywords) : [],
        collaborators: collaborators ? JSON.parse(collaborators) : []
    });

    return res.status(201).json(
        new ApiResponse(201, research, "Research created successfully")
    );
});

const getResearchById = asyncHandler(async (req, res) => {
    const research = await Research.findById(req.params.id)
        .populate('researcher', 'fullName email')
        .populate('collaborators', 'fullName email');

    if (!research) {
        throw new ApiError(404, "Research not found");
    }

    return res.status(200).json(
        new ApiResponse(200, research, "Research fetched successfully")
    );
});

const updateResearch = asyncHandler(async (req, res) => {
    const research = await Research.findById(req.params.id);

    if (!research) {
        throw new ApiError(404, "Research not found");
    }

    if (research.researcher.toString() !== req.user._id.toString() && 
        !research.collaborators.includes(req.user._id)) {
        throw new ApiError(403, "You don't have permission to update this research");
    }

    const updates = { ...req.body };

    if (req.files?.paper) {
        const paperFile = await uploadOnCloudinary(req.files.paper[0].path);
        if (paperFile) {
            updates.paper = {
                public_id: paperFile.public_id,
                url: paperFile.secure_url
            };
        }
    }

    if (req.files?.supporting_documents) {
        const newSupportingDocs = [];
        for (const doc of req.files.supporting_documents) {
            const uploadedDoc = await uploadOnCloudinary(doc.path);
            if (uploadedDoc) {
                newSupportingDocs.push({
                    public_id: uploadedDoc.public_id,
                    url: uploadedDoc.secure_url,
                    name: doc.originalname
                });
            }
        }
        updates.supporting_documents = [
            ...research.supporting_documents,
            ...newSupportingDocs
        ];
    }

    if (updates.keywords) {
        updates.keywords = JSON.parse(updates.keywords);
    }

    if (updates.collaborators) {
        updates.collaborators = JSON.parse(updates.collaborators);
    }

    const updatedResearch = await Research.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedResearch, "Research updated successfully")
    );
});

const deleteResearch = asyncHandler(async (req, res) => {
    const research = await Research.findById(req.params.id);

    if (!research) {
        throw new ApiError(404, "Research not found");
    }

    if (research.researcher.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the primary researcher can delete this research");
    }

    await Research.findByIdAndDelete(req.params.id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Research deleted successfully")
    );
});

const getAllResearch = asyncHandler(async (req, res) => {
    const research = await Research.find()
        .populate('researcher', 'fullName email')
        .populate('collaborators', 'fullName email');

    return res.status(200).json(
        new ApiResponse(200, research, "All research fetched successfully")
    );
});

const getMyResearch = asyncHandler(async (req, res) => {
    const research = await Research.find({
        $or: [
            { researcher: req.user._id },
            { collaborators: req.user._id }
        ]
    }).populate('researcher', 'fullName email')
      .populate('collaborators', 'fullName email');

    return res.status(200).json(
        new ApiResponse(200, research, "Your research fetched successfully")
    );
});

export {
    createResearch,
    getResearchById,
    updateResearch,
    deleteResearch,
    getAllResearch,
    getMyResearch
}; 