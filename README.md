# Medlink Telemedicine Backend API

A comprehensive Node.js + Express backend for a telemedicine application that connects patients with healthcare professionals. Built with MongoDB, featuring phone OTP authentication, JWT security, M-Pesa payments, and complete medical appointment management.

## 🚀 Features

- **Authentication & Authorization**
  - Phone number-based registration with OTP verification (Africa's Talking integration ready)
  - JWT-based authentication
  - Role-based access control (Patient, Doctor, Admin)

- **User Management**
  - Patient profiles with medical history
  - Doctor profiles with specializations and availability
  - User account management

- **Appointment System**
  - Book appointments with doctors
  - Multiple consultation types (video, audio, chat, in-person)
  - Appointment status tracking
  - Payment integration

- **Prescription Management**
  - Digital prescription creation by doctors
  - Prescription fulfillment tracking
  - Link prescriptions to appointments

- **Pharmacy Integration**
  - Pharmacy registration and management
  - Location-based pharmacy search
  - Prescription fulfillment

- **Payment Processing**
  - M-Pesa STK Push integration (ready for production)
  - Payment status tracking
  - Webhook handling for payment callbacks

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nickodee/medlink-backend.git
   cd medlink-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/medlink
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   
   # Africa's Talking (for OTP)
   AFRICASTALKING_USERNAME=sandbox
   AFRICASTALKING_API_KEY=your-api-key
   
   # M-Pesa Payment Integration
   MPESA_CONSUMER_KEY=your-consumer-key
   MPESA_CONSUMER_SECRET=your-consumer-secret
   MPESA_SHORTCODE=174379
   MPESA_PASSKEY=your-passkey
   MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/callback
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

   **Important Notes:**
   - The `JWT_SECRET` should be a long, random string in production
   - Use a strong password for MongoDB in production
   - Update `CORS_ORIGIN` to your frontend domain
   - M-Pesa credentials are for sandbox testing by default

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
medlink-backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── doctorController.js  # Doctor management
│   │   ├── patientController.js # Patient management
│   │   ├── appointmentController.js
│   │   ├── prescriptionController.js
│   │   ├── pharmacyController.js
│   │   └── paymentController.js # M-Pesa payment handling
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── errorHandler.js      # Global error handler
│   ├── models/
│   │   ├── User.js              # Base user model
│   │   ├── Doctor.js            # Doctor profile model
│   │   ├── Patient.js           # Patient profile model
│   │   ├── Appointment.js       # Appointment model
│   │   ├── Prescription.js      # Prescription model
│   │   └── Pharmacy.js          # Pharmacy model
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── prescriptionRoutes.js
│   │   ├── pharmacyRoutes.js
│   │   └── paymentRoutes.js
│   ├── services/
│   │   ├── otpService.js        # Phone OTP service (Africa's Talking)
│   │   └── mpesaService.js      # M-Pesa STK Push service
│   └── utils/
│       └── jwt.js               # JWT utility functions
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
├── server.js                    # Application entry point
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-otp` - Verify phone OTP
- `POST /api/auth/login` - Login user
- `POST /api/auth/resend-otp` - Resend OTP
- `GET /api/auth/me` - Get current user (Protected)

### Doctors
- `POST /api/doctors` - Create doctor profile (Protected: Admin/Doctor)
- `GET /api/doctors` - Get all doctors (Public)
- `GET /api/doctors/:id` - Get doctor by ID (Public)
- `PUT /api/doctors/:id` - Update doctor profile (Protected: Doctor/Admin)
- `DELETE /api/doctors/:id` - Delete doctor profile (Protected: Admin)

### Patients
- `GET /api/patients` - Get all patients (Protected: Doctor/Admin)
- `GET /api/patients/:id` - Get patient by ID (Protected)
- `GET /api/patients/user/:userId` - Get patient by user ID (Protected)
- `PUT /api/patients/:id` - Update patient profile (Protected)
- `DELETE /api/patients/:id` - Delete patient profile (Protected: Admin)

### Appointments
- `POST /api/appointments` - Create appointment (Protected: Patient)
- `GET /api/appointments` - Get all appointments (Protected)
- `GET /api/appointments/:id` - Get appointment by ID (Protected)
- `PUT /api/appointments/:id` - Update appointment (Protected)
- `PUT /api/appointments/:id/cancel` - Cancel appointment (Protected)
- `DELETE /api/appointments/:id` - Delete appointment (Protected: Admin)

### Prescriptions
- `POST /api/prescriptions` - Create prescription (Protected: Doctor)
- `GET /api/prescriptions` - Get all prescriptions (Protected)
- `GET /api/prescriptions/:id` - Get prescription by ID (Protected)
- `PUT /api/prescriptions/:id` - Update prescription (Protected: Doctor)
- `PUT /api/prescriptions/:id/fulfill` - Fulfill prescription (Protected)
- `DELETE /api/prescriptions/:id` - Delete prescription (Protected: Doctor/Admin)

### Pharmacies
- `POST /api/pharmacies` - Create pharmacy (Protected: Admin)
- `GET /api/pharmacies` - Get all pharmacies (Public)
- `GET /api/pharmacies/nearby` - Get nearby pharmacies (Public)
- `GET /api/pharmacies/:id` - Get pharmacy by ID (Public)
- `PUT /api/pharmacies/:id` - Update pharmacy (Protected: Admin)
- `DELETE /api/pharmacies/:id` - Delete pharmacy (Protected: Admin)

### Payments
- `POST /api/payments/callback` - M-Pesa payment callback (Public)
- `GET /api/payments/status/:checkoutRequestId` - Check payment status (Protected)

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Example API Usage

### Register a new patient
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+254712345678",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123",
    "role": "patient"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. OTP sent to phone.",
  "data": {
    "userId": "64a1b2c3d4e5f6789",
    "phone": "+254712345678",
    "role": "patient"
  },
  "otp": "123456"
}
```

**Note:** OTP is only returned in development mode for testing purposes.

### Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+254712345678",
    "otp": "123456"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Phone verified successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64a1b2c3d4e5f6789",
      "phone": "+254712345678",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "patient"
    }
  }
}
```

### Create an appointment
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "patientId": "64a1b2c3d4e5f6789",
    "doctorId": "64a1b2c3d4e5f6790",
    "appointmentDate": "2025-11-01",
    "appointmentTime": "10:00",
    "type": "video",
    "reason": "General checkup and consultation for persistent headaches",
    "paymentAmount": 1000,
    "paymentPhone": "+254712345678"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6791",
    "patientId": "64a1b2c3d4e5f6789",
    "doctorId": "64a1b2c3d4e5f6790",
    "appointmentDate": "2025-11-01T00:00:00.000Z",
    "appointmentTime": "10:00",
    "type": "video",
    "reason": "General checkup and consultation for persistent headaches",
    "status": "scheduled",
    "payment": {
      "amount": 1000,
      "status": "pending",
      "transactionId": "mock_checkout_1234567890"
    }
  }
}
```

## 🔧 Development

### Running in development mode
```bash
npm run dev
```

This uses nodemon for automatic server restart on file changes.

### Input Validation

All API endpoints include comprehensive input validation. Invalid requests return detailed error messages:

**Example validation error response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "phone",
      "message": "Phone number must be in E.164 format (e.g., +254712345678)"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

**Validation Rules:**
- **Phone numbers**: Must be in E.164 format (e.g., +254712345678)
- **Passwords**: Minimum 8 characters, must contain uppercase, lowercase, and number
- **Emails**: Must be valid RFC 5322 compliant email addresses
- **Dates**: Must be in ISO 8601 format
- **MongoDB IDs**: Must be valid ObjectId format
- **Appointment reasons**: Minimum 10 characters, maximum 500 characters

## 📦 Dependencies

### Core Dependencies
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **express-validator** - Input validation
- **axios** - HTTP client for external APIs
- **helmet** - Security headers middleware
- **express-rate-limit** - Rate limiting middleware
- **morgan** - HTTP request logger

### Dev Dependencies
- **nodemon** - Auto-restart development server

## 🚀 Production Deployment

### Important considerations for production:

1. **Environment Variables**: Set all required environment variables
2. **Database**: Use MongoDB Atlas or managed MongoDB instance with authentication
3. **SSL/TLS**: Enable HTTPS for secure communication
4. **Africa's Talking**: Configure with production credentials
5. **M-Pesa**: Switch to production endpoints and credentials
6. **Monitoring**: Set up application monitoring and error tracking
7. **Backups**: Implement automated database backups

### Example production setup:
```bash
# Install production dependencies only
npm install --production

# Set NODE_ENV to production
export NODE_ENV=production

# Start the server
npm start
```

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication with configurable expiration
- Role-based access control (Patient, Doctor, Admin)
- Input validation and sanitization with express-validator
- CORS configuration with configurable origins
- Environment variable protection
- **Rate Limiting**: 
  - General API: 100 requests per 15 minutes per IP
  - Auth routes: 5 requests per 15 minutes per IP
- **Security Headers**: Helmet.js integration for HTTP security headers
- **Request Logging**: Morgan logger for development and production
- **Phone Number Validation**: E.164 format enforcement (e.g., +254712345678)
- **Email Validation**: RFC 5322 compliant email validation

### ✅ Implemented Security Features

The following security features are now implemented in the codebase:

1. **✅ Rate Limiting**: Implemented using `express-rate-limit`
   - General API routes: 100 requests per 15 minutes
   - Authentication routes: 5 requests per 15 minutes

2. **✅ Input Validation**: Comprehensive validation using `express-validator`
   - All routes have input validation middleware
   - Phone numbers validated in E.164 format
   - Email validation with RFC 5322 compliance
   - Password strength requirements enforced

3. **✅ CORS Configuration**: Configured to allow specific trusted domains via environment variable

4. **✅ Security Headers**: Helmet.js integrated for HTTP security headers

5. **✅ Request Logging**: Morgan logger configured for development and production

6. **✅ Error Handling**: Enhanced error handler with proper status codes and messages

### ⚠️ Additional Security Recommendations for Production

## 🧪 Testing

To add testing to the project:

```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Add test script to package.json
"test": "jest"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Medlink Team

## 📞 Support

For support, email support@medlink.com or join our Slack channel.

## 🙏 Acknowledgments

- Africa's Talking for SMS/OTP services
- Safaricom for M-Pesa payment integration
- MongoDB for database solutions
- Express.js community

---

**Note**: This is a backend API. You'll need to build a separate frontend application to consume these endpoints. The placeholder implementations for Africa's Talking and M-Pesa should be replaced with actual API integrations for production use.