// Africa's Talking OTP Service (Placeholder Implementation)
// To integrate with actual Africa's Talking API:
// 1. Install: npm install africastalking
// 2. Replace the mock functions with actual API calls

const generateOTP = () => {
  // Generate 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (phone, otp) => {
  try {
    // PLACEHOLDER: In production, integrate with Africa's Talking API
    console.log(`[OTP Service] Sending OTP ${otp} to ${phone}`);
    
    // Uncomment and configure for production:
    /*
    const AfricasTalking = require('africastalking');
    const africastalking = AfricasTalking({
      apiKey: process.env.AFRICASTALKING_API_KEY,
      username: process.env.AFRICASTALKING_USERNAME,
    });
    
    const sms = africastalking.SMS;
    const result = await sms.send({
      to: [phone],
      message: `Your Medlink verification code is: ${otp}. Valid for 10 minutes.`,
    });
    
    return result;
    */
    
    // Mock success response
    return {
      success: true,
      message: `OTP sent to ${phone}`,
      // In development, you can return the OTP for testing
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

const verifyOTP = (userOTP, storedOTP, otpExpires) => {
  if (!storedOTP || !otpExpires) {
    return { valid: false, message: 'No OTP found' };
  }
  
  if (new Date() > otpExpires) {
    return { valid: false, message: 'OTP has expired' };
  }
  
  if (userOTP !== storedOTP) {
    return { valid: false, message: 'Invalid OTP' };
  }
  
  return { valid: true, message: 'OTP verified successfully' };
};

module.exports = {
  generateOTP,
  sendOTP,
  verifyOTP,
};
