// /**
//  * Calculate registration fees based on category and workshop interest
//  * @param {String} registrationCategory - member, non_member, student_paramedic, international
//  * @param {Boolean} interestedInWorkshop - Workshop interest
//  * @param {Boolean} isGroup - Is group registration (for 15% discount)
//  * @param {Number} memberCount - Number of members (default 1, for group 5)
//  * @returns {Object} - Fee breakdown
//  */


export const calculateFees = (
  registrationCategory,
  interestedInWorkshop = false,
  isGroup = false,
  memberCount = 1
) => {
  // Base fee structure (till 31st December)
  const baseFees = {
    member: 1800,
    non_member: 2000,
    student_paramedic: 1500,
    international: 3000,
  };

  // Workshop fee and GST rate
  const workshopBaseFee = 800;
  const gstRate = 0.18; // 18%

  // Calculate registration fee
  let registrationFee = baseFees[registrationCategory] || 0;
  registrationFee = registrationFee * memberCount;

  // Calculate workshop fee
  let workshopFee = 0;
  let gstAmount = 0;

  if (interestedInWorkshop) {
    workshopFee = workshopBaseFee * memberCount;
    gstAmount = workshopFee * gstRate;
  }

  // Calculate subtotal
  let subtotal = registrationFee + workshopFee + gstAmount;

  // Calculate discount (15% for group)
  let discount = 0;
  if (isGroup && memberCount === 5) {
    discount = subtotal * 0.15;
  }

  // Calculate total amount
  const totalAmount = subtotal - discount;

  return {
    registrationFee: Math.round(registrationFee * 100) / 100,
    workshopFee: Math.round(workshopFee * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
};