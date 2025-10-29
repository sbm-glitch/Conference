import mongoose from 'mongoose';

const groupRegistrationSchema = new mongoose.Schema(
  {
    // Primary Contact (Single email for entire group)
    primaryEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // Array of member IDs (references to Registration model)
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Registration',
      },
    ],

    // Group Details
    totalMembers: {
      type: Number,
      required: true,
      default: 5,
    },

    // Fee Calculation for entire group
    groupRegistrationFee: {
      type: Number,
      required: true,
    },
    groupWorkshopFee: {
      type: Number,
      default: 0,
    },
    groupGstAmount: {
      type: Number,
      default: 0,
    },
    groupDiscount: {
      type: Number,
      default: 0, // 15% discount
    },
    groupTotalAmount: {
      type: Number,
      required: true,
    },

    // Payment Information (Single payment for entire group)
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

    // Group Registration Details
    groupRegistrationId: {
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

// Generate Group Registration ID before saving
groupRegistrationSchema.pre('save', async function (next) {
  if (!this.groupRegistrationId && this.paymentStatus === 'completed') {
    const count = await mongoose.models.GroupRegistration.countDocuments();
    this.groupRegistrationId = `WFDD2024-GRP-${String(count + 1).padStart(6, '0')}`;
    this.registrationDate = new Date();
  }
  next();
});

const GroupRegistration = mongoose.model('GroupRegistration', groupRegistrationSchema);

export default GroupRegistration;