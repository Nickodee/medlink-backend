const express = require('express');
const router = express.Router();
const {
  mpesaCallback,
  checkPaymentStatus,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/callback', mpesaCallback);
router.get('/status/:checkoutRequestId', protect, checkPaymentStatus);

module.exports = router;
