import mongoose from "mongoose";

const startupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    founder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    description: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    stage: {
        type: String,
        enum: ["Ideation", "Validation", "Early Traction", "Scaling"],
        required: true
    },
    logo: {
        public_id: String,
        url: String
    },
    pitch_deck: {
        public_id: String,
        url: String
    },
    team_size: {
        type: Number,
        default: 1
    },
    website: String,
    social_links: {
        linkedin: String,
        twitter: String
    },
    funding_raised: {
        type: Number,
        default: 0
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export const Startup = mongoose.model("Startup", startupSchema); 