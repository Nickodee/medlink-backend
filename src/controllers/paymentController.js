const Appointment = require('../models/Appointment');
const { querySTKPushStatus } = require('../services/mpesaService');

// @desc    Handle M-Pesa payment callback
// @route   POST /api/payments/callback
// @access  Public (M-Pesa callback)
const mpesaCallback = async (req, res) => {
  try {
    console.log('M-Pesa Callback received:', JSON.stringify(req.body, null, 2));

    const { Body } = req.body;

    if (!Body || !Body.stkCallback) {
      return res.status(400).json({
        success: false,
        message: 'Invalid callback data',
      });
    }

    const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = Body.stkCallback;

    // Find appointment by transaction ID
    const appointment = await Appointment.findOne({
      'payment.transactionId': CheckoutRequestID,
    });

    if (!appointment) {
      console.log('Appointment not found for transaction:', CheckoutRequestID);
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Update payment status based on result code
    if (ResultCode === 0) {
      // Payment successful
      appointment.payment.status = 'completed';
      
      if (CallbackMetadata && CallbackMetadata.Item) {
        const items = CallbackMetadata.Item;
        const mpesaReceiptNumber = items.find(item => item.Name === 'MpesaReceiptNumber');
        
        if (mpesaReceiptNumber) {
          appointment.payment.paymentMethod = 'M-Pesa';
        }
      }
      
      appointment.status = 'confirmed';
    } else {
      // Payment failed
      appointment.payment.status = 'failed';
    }

    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Callback processed successfully',
    });
  } catch (error) {
    console.error('Error processing M-Pesa callback:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing callback',
    });
  }
};

// @desc    Check payment status
// @route   GET /api/payments/status/:checkoutRequestId
// @access  Private
const checkPaymentStatus = async (req, res) => {
  try {
    const { checkoutRequestId } = req.params;

    const status = await querySTKPushStatus(checkoutRequestId);

    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error checking payment status',
    });
  }
};

module.exports = {
  mpesaCallback,
  checkPaymentStatus,
};
