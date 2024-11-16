import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Startup } from "../models/startup.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createStartup = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        industry,
        stage,
        team_size,
        website,
        social_links
    } = req.body;

    if (!name || !description || !industry || !stage) {
        throw new ApiError(400, "All required fields must be filled");
    }

    let logoUrl;
    let pitchDeckUrl;

    if (req.files?.logo) {
        const logoFile = await uploadOnCloudinary(req.files.logo[0].path);
        if (logoFile) {
            logoUrl = {
                public_id: logoFile.public_id,
                url: logoFile.secure_url
            };
        }
    }

    if (req.files?.pitch_deck) {
        const pitchFile = await uploadOnCloudinary(req.files.pitch_deck[0].path);
        if (pitchFile) {
            pitchDeckUrl = {
                public_id: pitchFile.public_id,
                url: pitchFile.secure_url
            };
        }
    }

    const startup = await Startup.create({
        name,
        founder: req.user._id,
        description,
        industry,
        stage,
        logo: logoUrl,
        pitch_deck: pitchDeckUrl,
        team_size: team_size || 1,
        website,
        social_links: social_links ? JSON.parse(social_links) : {}
    });

    return res.status(201).json(
        new ApiResponse(201, startup, "Startup created successfully")
    );
});

const getStartupById = asyncHandler(async (req, res) => {
    const startup = await Startup.findById(req.params.id)
        .populate('founder', 'fullName email');

    if (!startup) {
        throw new ApiError(404, "Startup not found");
    }

    return res.status(200).json(
        new ApiResponse(200, startup, "Startup fetched successfully")
    );
});

const updateStartup = asyncHandler(async (req, res) => {
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
        throw new ApiError(404, "Startup not found");
    }

    if (startup.founder.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to update this startup");
    }

    const updates = { ...req.body };

    if (req.files?.logo) {
        const logoFile = await uploadOnCloudinary(req.files.logo[0].path);
        if (logoFile) {
            updates.logo = {
                public_id: logoFile.public_id,
                url: logoFile.secure_url
            };
        }
    }

    if (req.files?.pitch_deck) {
        const pitchFile = await uploadOnCloudinary(req.files.pitch_deck[0].path);
        if (pitchFile) {
            updates.pitch_deck = {
                public_id: pitchFile.public_id,
                url: pitchFile.secure_url
            };
        }
    }

    if (updates.social_links) {
        updates.social_links = JSON.parse(updates.social_links);
    }

    const updatedStartup = await Startup.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedStartup, "Startup updated successfully")
    );
});

const deleteStartup = asyncHandler(async (req, res) => {
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
        throw new ApiError(404, "Startup not found");
    }

    if (startup.founder.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to delete this startup");
    }

    await Startup.findByIdAndDelete(req.params.id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Startup deleted successfully")
    );
});

const getAllStartups = asyncHandler(async (req, res) => {
    const startups = await Startup.find()
        .populate('founder', 'fullName email');

    return res.status(200).json(
        new ApiResponse(200, startups, "All startups fetched successfully")
    );
});

const getMyStartups = asyncHandler(async (req, res) => {
    const startups = await Startup.find({ founder: req.user._id });

    return res.status(200).json(
        new ApiResponse(200, startups, "Your startups fetched successfully")
    );
});

export {
    createStartup,
    getStartupById,
    updateStartup,
    deleteStartup,
    getAllStartups,
    getMyStartups
}; 