import Registration from '../models/registration.model.js';
import { calculateFees } from '../utils/feeCalculator.js';
import { sendEmail } from '../utils/sendEmail.js';

/**
 * Individual Registration
 * POST /api/registration/individual(pending)
 */
export const individualRegistration = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobileNo,
      otherContact,
      gender,
      dob,
      designation,
      institutionOrganization,
      city,
      state,
      medicalCouncilRegNo,
      afpiRegNo,
      heardAboutConference,
      attendedPrevious,
      registrationCategory,
      interestedInWorkshop,
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !mobileNo || !gender || !dob || !designation ||
      !institutionOrganization || !city || !state || !heardAboutConference ||
      attendedPrevious === undefined || !registrationCategory) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
      });
    }

    // Calculate fees
    const fees = calculateFees(
      registrationCategory,
      interestedInWorkshop || false,
      false, // Not group
      1 // Single member
    );

    // Create registration
    const registration = new Registration({
      fullName,
      email: email.toLowerCase(),
      mobileNo,
      otherContact,
      gender,
      dob,
      designation,
      institutionOrganization,
      city,
      state,
      medicalCouncilRegNo,
      afpiRegNo,
      heardAboutConference,
      attendedPrevious,
      registrationCategory,
      interestedInWorkshop: interestedInWorkshop || false,
      registrationFee: fees.registrationFee,
      workshopFee: fees.workshopFee,
      gstAmount: fees.gstAmount,
      discount: fees.discount,
      totalAmount: fees.totalAmount,
      paymentStatus: 'pending',
      isGroupMember: false,
    });

    await registration.save();

    // ✅ Send confirmation email
    const htmlContent = `
      <h2>Registration Successful 🎉</h2>
      <p>Dear ${fullName},</p>
      <p>Your registration for the conference has been successfully completed.</p>
      <p><strong>Registration ID:</strong> ${registration._id}</p>
      <p><strong>Total Amount:</strong> ₹${fees.totalAmount}</p>
      <p>We look forward to seeing you at the conference!</p>
      <br/>
      <p>Best regards,<br/>Conference Team</p>
    `;

    await sendEmail(email, "🎉 Registration Confirmation - AFPICON WB 2026", htmlContent);


    return res.status(201).json({
      success: true,
      message: 'Registration created successfully',
      data: {
        registrationId: registration._id,
        fees: {
          registrationFee: fees.registrationFee,
          workshopFee: fees.workshopFee,
          gstAmount: fees.gstAmount,
          discount: fees.discount,
          totalAmount: fees.totalAmount,
        },
      },
    });
  } catch (error) {
    console.error('Individual Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

/**
 * Get Registration by ID
 * GET /api/registration/:id(pending)
 */
export const getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await Registration.findById(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error('Get Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch registration',
      error: error.message,
    });
  }
};