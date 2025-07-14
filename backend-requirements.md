# Backend Requirements for Virtual Try-On Jewellery App

## Tech Stack
- **Framework**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: JWT tokens
- **File Storage**: AWS S3 or local storage
- **Image Processing**: OpenCV, PIL, or similar
- **Payment**: Stripe/Razorpay integration

## Database Schema (MongoDB Collections)

### 1. Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  mobile: String (unique),
  firstName: String,
  lastName: String,
  passwordHash: String,
  avatar: String (optional),
  preferences: {
    favoriteCategories: [String],
    notifications: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  category: String, // 'Silver', 'Diamond', 'Platinum', 'Gold'
  description: String,
  price: Number,
  images: [String], // Array of image URLs
  preorderAvailable: Boolean,
  inStock: Boolean,
  specifications: {
    material: String,
    weight: String,
    dimensions: String,
    gemstone: String
  },
  rating: Number,
  reviews: Number,
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Orders Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    productName: String,
    productImage: String,
    quantity: Number,
    price: Number,
    isPreorder: Boolean
  }],
  totalAmount: Number,
  status: String, // 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
  paymentStatus: String, // 'pending', 'completed', 'failed', 'refunded'
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  estimatedDelivery: Date,
  trackingNumber: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Payments Collection
```javascript
{
  _id: ObjectId,
  orderId: ObjectId,
  amount: Number,
  currency: String,
  method: String, // 'card', 'upi', 'netbanking', 'wallet'
  status: String, // 'pending', 'processing', 'completed', 'failed', 'cancelled'
  transactionId: String,
  gatewayResponse: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. UploadedImages Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  originalUrl: String,
  processedUrl: String,
  fileName: String,
  fileSize: Number,
  mimeType: String,
  metadata: {
    width: Number,
    height: Number,
    faceDetected: Boolean,
    neckPosition: {
      x: Number,
      y: Number,
      width: Number,
      height: Number
    }
  },
  uploadedAt: Date
}
```

### 6. TryOnResults Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  productId: ObjectId,
  userImageId: ObjectId,
  resultImageUrl: String,
  adjustments: {
    scale: Number,
    rotation: Number,
    position: {
      x: Number,
      y: Number
    }
  },
  shared: Boolean,
  shareUrl: String,
  createdAt: Date
}
```

## API Endpoints

### Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
PUT /api/auth/profile
POST /api/auth/change-password
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/refresh
```

### Product Endpoints
```
GET /api/products
GET /api/products/{id}
GET /api/products/category/{category}
GET /api/products/featured
GET /api/products/search?q={query}
GET /api/products/{id}/recommendations
```

### Order Endpoints
```
POST /api/orders
GET /api/orders
GET /api/orders/{id}
POST /api/orders/{id}/cancel
```

### Payment Endpoints
```
POST /api/payments/create-intent
POST /api/payments/confirm
GET /api/payments/methods
POST /api/payments/methods
DELETE /api/payments/methods/{id}
GET /api/payments/history
GET /api/payments/{id}
POST /api/payments/{id}/refund
```

### Image & Try-On Endpoints
```
POST /api/images/upload
GET /api/images/user
DELETE /api/images/{id}
POST /api/images/{id}/process
POST /api/try-on/create
GET /api/try-on/results
GET /api/try-on/results/{id}
PUT /api/try-on/results/{id}
DELETE /api/try-on/results/{id}
POST /api/try-on/results/{id}/save
POST /api/try-on/results/{id}/share
```

## Key Features to Implement

### 1. Authentication & Authorization
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Session management

### 2. Product Management
- CRUD operations for products
- Category filtering
- Search functionality
- Inventory management
- Featured products

### 3. Order Management
- Cart functionality
- Order creation and tracking
- Status updates
- Email notifications

### 4. Payment Integration
- Razorpay/Stripe integration
- Payment intent creation
- Payment confirmation
- Refund processing
- Payment method storage

### 5. Image Processing & Try-On
- Image upload and validation
- Face detection using OpenCV
- Neck area identification
- Jewelry overlay processing
- Image transformation (scale, rotate, position)
- Result image generation

### 6. File Storage
- Image upload to S3/local storage
- Image optimization and compression
- Multiple image sizes generation
- Secure file access

### 7. Security Features
- Input validation and sanitization
- Rate limiting
- CORS configuration
- File upload security
- SQL injection prevention

## Environment Variables
```
# Database
MONGODB_URL=mongodb://localhost:27017/jewelry_store

# JWT
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# File Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=your-region

# Payment
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email
SMTP_PASSWORD=your-password

# App
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ORIGINS=http://localhost:5173
```

## Dependencies (requirements.txt)
```
fastapi==0.104.1
uvicorn==0.24.0
motor==3.3.2
pymongo==4.6.0
pydantic==2.5.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
pillow==10.1.0
opencv-python==4.8.1.78
boto3==1.34.0
razorpay==1.4.1
python-dotenv==1.0.0
email-validator==2.1.0
aiofiles==23.2.1
```

## Deployment Considerations
- Use Docker for containerization
- Set up MongoDB Atlas for production
- Configure AWS S3 for file storage
- Set up Redis for caching
- Use Nginx as reverse proxy
- Implement logging and monitoring
- Set up CI/CD pipeline
- Configure SSL certificates