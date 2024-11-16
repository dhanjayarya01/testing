import mongoose from "mongoose";

const researchSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    researcher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    abstract: {
        type: String,
        required: true
    },
    field: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Ongoing", "Completed", "On Hold"],
        default: "Ongoing"
    },
    paper: {
        public_id: String,
        url: String
    },
    supporting_documents: [{
        public_id: String,
        url: String,
        name: String
    }],
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    keywords: [String],
    publication_status: {
        is_published: {
            type: Boolean,
            default: false
        },
        journal_name: String,
        publication_date: Date
    }
}, { timestamps: true });

export const Research = mongoose.model("Research", researchSchema); 