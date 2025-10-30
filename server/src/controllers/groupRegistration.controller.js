import GroupRegistration from '../models/groupRegistration.model.js';
import { calculateFees } from '../utils/feeCalculator.js';

/**
 * Group Registration (5 members)
 * POST /api/registration/group(pending)
 */
export const groupRegistration = async (req, res) => {
    try {
        const { primaryEmail, members } = req.body;

        // Validate primary email
        if (!primaryEmail) {
            return res.status(400).json({
                success: false,
                message: 'Primary email is required',
            });
        }

        // Validate members array
        if (!members || !Array.isArray(members) || members.length !== 5) {
            return res.status(400).json({
                success: false,
                message: 'Exactly 5 members are required for group registration',
            });
        }

        // Validate each member has required fields
        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            if (
                !member.fullName ||
                !member.email ||
                !member.mobileNo ||
                !member.gender ||
                !member.dob ||
                !member.designation ||
                !member.institutionOrganization ||
                !member.city ||
                !member.state ||
                !member.heardAboutConference ||
                member.attendedPrevious === undefined ||
                !member.registrationCategory
            ) {
                return res.status(400).json({
                    success: false,
                    message: `Member ${i + 1} is missing required fields`,
                });
            }
        }

        // Calculate total workshop interest
        const workshopInterestedCount = members.filter(
            (m) => m.interestedInWorkshop === true
        ).length;

        // Get first member's category for base fee calculation (or you can make it mixed)
        const firstMemberCategory = members[0].registrationCategory;

        // Calculate fees for group (with 15% discount)
        const fees = calculateFees(
            firstMemberCategory,
            workshopInterestedCount > 0, // If any member interested in workshop
            true, // Is group
            workshopInterestedCount // Number of members interested in workshop
        );

        // Create group registration
        const groupRegistration = new GroupRegistration({
            primaryEmail: primaryEmail.toLowerCase(),
            members: members.map((member) => ({
                ...member,
                email: member.email.toLowerCase(),
            })),
            totalMembers: members.length,
            groupRegistrationFee: fees.registrationFee, 
            groupWorkshopFee: fees.workshopFee,         
            groupGstAmount: fees.gstAmount,             
            groupDiscount: fees.discount,              
            groupTotalAmount: fees.totalAmount,        
            paymentStatus: 'pending',
        });


        await groupRegistration.save();

        return res.status(201).json({
            success: true,
            message: 'Group registration created successfully',
            data: {
                groupRegistrationId: groupRegistration._id,
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
        console.error('Group Registration Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Group registration failed',
            error: error.message,
        });
    }
};

/**
 * Get Group Registration by ID
 * GET /api/registration/group/:id (pending)
 */
export const getGroupRegistrationById = async (req, res) => {
    try {
        const { id } = req.params;

        const groupRegistration = await GroupRegistration.findById(id);

        if (!groupRegistration) {
            return res.status(404).json({
                success: false,
                message: 'Group registration not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: groupRegistration,
        });
    } catch (error) {
        console.error('Get Group Registration Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch group registration',
            error: error.message,
        });
    }
};