# SoundBeatX Backend

This is the backend service for the SoundBeatX application, built with Node.js, Express, and MongoDB Atlas.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with your MongoDB Atlas credentials:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   DB_NAME=soundbeatx
   JWT_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

3. Seed the database with initial data:
   ```
   npm run seed
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. For production:
   ```
   npm start
   ```

## API Endpoints

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get a specific product
- POST `/api/products` - Create a new product
- PUT `/api/products/:id` - Update a product
- DELETE `/api/products/:id` - Delete a product

### Authentication
- POST `/api/auth/signup` - User signup
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
- GET `/api/auth/profile` - Get user profile

## Database Schema

The application uses MongoDB with the following collections:

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  price: Number (required),
  category: String (required),
  image: String,
  created_at: Date,
  updated_at: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  user_id: String (required),
  items: [{
    product_id: ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  shipping_address: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  subtotal: Number,
  shipping: Number,
  total: Number,
  payment_method: String,
  payment_status: String,
  order_status: String,
  stripe_payment_intent_id: String,
  created_at: Date,
  updated_at: Date
}
```

### Admins Collection
```javascript
{
  _id: ObjectId,
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (admin/super_admin),
  is_active: Boolean,
  last_login: Date,
  created_at: Date,
  updated_at: Date
}
```