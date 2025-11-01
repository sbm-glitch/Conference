import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
    {
        // Personal Information
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        mobileNo: {
            type: String,
            required: true,
            trim: true,
        },
        otherContact: {
            type: String,
            trim: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ['male', 'female', 'third_gender'],
        },
        dob: {
            type: Date,
            required: true,
        },

        // Professional Information
        designation: {
            type: String,
            required: true,
            trim: true,
        },
        institutionOrganization: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            required: true,
        },
        medicalCouncilRegNo: {
            type: String,
            trim: true,
        },
        afpiRegNo: {
            type: String,
            trim: true,
        },

        // Conference Information
        heardAboutConference: {
            type: String,
            required: true,
            enum: [
                'whatsapp',
                'email',
                'facebook',
                'instagram',
                'colleague',
                'medical_association',
                'other',
            ],
        },
        attendedPrevious: {
            type: Boolean,
            required: true,
        },

        // Registration Category
        registrationCategory: {
            type: String,
            required: true,
            enum: ['member', 'non_member', 'student_paramedic', 'international'],
        },

        // Workshop
        interestedInWorkshop: {
            type: Boolean,
            default: false,
        },

        // Fee Calculation
        registrationFee: {
            type: Number,
            required: true,
        },
        workshopFee: {
            type: Number,
            default: 0,
        },
        gstAmount: {
            type: Number,
            default: 0,
        },
        discount: {
            type: Number,
            default: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
        },

        // Payment Information
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        razorpayOrderId: {
            type: String,
        },
        razorpayPaymentId: {
            type: String,
        },
        razorpaySignature: {
            type: String,
        },
        paymentDate: {
            type: Date,
        },

        // Registration Details
        registrationId: {
            type: String,
            unique: true,
        },
        registrationDate: {
            type: Date,
        },
        confirmationEmailSent: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Generate Registration ID before saving
registrationSchema.pre('save', async function (next) {
    // Generate unique ID only if missing
    if (!this.registrationId) {
        const count = await mongoose.models.Registration.countDocuments();
        this.registrationId = `WFDD2024-${String(count + 1).padStart(6, '0')}`;
    }

    // Add registration date if payment is completed
    if (this.paymentStatus === 'completed' && !this.registrationDate) {
        this.registrationDate = new Date();
    }

    next();
});


const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;