import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

// Define sub-schemas for different user types
const walletSchema = new mongoose.Schema({
    balance: {
        type: Number,
        default: 0,
        min: 0
    },
    transactions: [{
        type: {
            type: String,
            enum: ['credit', 'debit'],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
});

const researcherSchema = {
    institution: String,
    researchArea: String,
    currentProjects: String,
    wallet: {
        type: walletSchema,
        default: () => ({
            balance: 0,
            transactions: []
        })
    }
};

const innovatorSchema = {
    startUpName: String,
    industrySector: String,
    developmentStage: { type: String, enum: ["Prototype", "MVP", "Scaling"] },
    fundingRequirement: { type: Boolean, default: false },
    fundingAmount: Number,
    wallet: {
        type: walletSchema,
        default: () => ({
            balance: 0,
            transactions: []
        })
    }
};

const mentorSchema = {
    expertiseArea: String,
    experienceYears: Number,
    availability: { type: String, enum: ["Full-Time", "Part-Time", "Flexible"] },
};

const investorSchema = {
    focusAreas: [String],
    investmentCapacityRange: String,
    fundingStagePreference: { type: String, enum: ["Seed", "Series A", "Series B", "Growth"] },
    portfolio: String,
};

const policyMakerSchema = {
    departmentName: String,
    roleTitle: String,
    interestArea: String,
};

const iprProfessionalSchema = {
    specialization: String,
    experienceYears: Number,
    notableCases: String,
};

// Add wallet schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    userType: {
        type: String,
        required: true,
        enum: [
            "Researcher",
            "Innovator",
            "Entrepreneur",
            "Mentor",
            "Investor",
            "Funding Agency",
            "Policy Maker",
            "IPR Professional",
        ],
    },
    organizationName: {
        type: String,
    },
    // location: {
    //     country: String,
    //     state: String,
    //     city: String,
    // },
    // phoneNumber: {
    //     type: String,
    // },
    // socialMediaProfile: {
    //     type: String,
    // },

    profileDetails: {
        type: mongoose.Schema.Types.Mixed, 
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

// Modify the pre-save middleware to initialize wallet only for specific user types
UserSchema.pre("save", function (next) {
    // Don't override existing profile details if they're already set
    if (Object.keys(this.profileDetails).length > 0) {
        return next();
    }

   
    switch (this.userType) {
        case "Researcher":
            this.profileDetails = {
                institution: "",
                researchArea: "",
                currentProjects: "",
                wallet: {
                    balance: 0,
                    transactions: []
                }
            };
            break;
        case "Innovator":
        case "Entrepreneur":
            this.profileDetails = {
                startUpName: "",
                industrySector: "",
                developmentStage: "",
                fundingRequirement: false,
                fundingAmount: 0,
                wallet: {
                    balance: 0,
                    transactions: []
                }
            };
            break;
        case "Mentor":
            this.profileDetails = {
                expertiseArea: "",
                experienceYears: 0,
                availability: ""
            };
            break;
        case "Investor":
        case "Funding Agency":
            this.profileDetails = {
                focusAreas: [],
                investmentCapacityRange: "",
                fundingStagePreference: "",
                portfolio: ""
            };
            break;
        case "Policy Maker":
            this.profileDetails = {
                departmentName: "",
                roleTitle: "",
                interestArea: ""
            };
            break;
        case "IPR Professional":
            this.profileDetails = {
                specialization: "",
                experienceYears: 0,
                notableCases: ""
            };
            break;
        default:
            this.profileDetails = {};
    }
    next();
});


UserSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = function(){
    console.log("ACCESS_TOKEN_SECRET",process.env.ACCESS_TOKEN_SECRET)
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userType: this.userType
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

//validation method in model for wallet access 
UserSchema.methods.hasWalletAccess = function() {
    return ["Researcher", "Innovator"].includes(this.userType) && 
           this.profileDetails?.wallet !== undefined;
};

export const User = mongoose.model("User", UserSchema); 