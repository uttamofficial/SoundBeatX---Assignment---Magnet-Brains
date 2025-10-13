const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    trim: true
  },
  items: {
    type: [{
      id: {
        type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and Number
        required: true
      },
      product_id: {
        type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and Number
        ref: 'Product'
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      image: String
    }],
    required: true,
    validate: {
      validator: function(items) {
        return items && items.length > 0;
      },
      message: 'Order must have at least one item'
    }
  },
  shipping_address: {
    type: {
      fullName: {
        type: String,
        trim: true
      },
      name: {
        type: String,
        trim: true
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
      },
      phone: {
        type: String,
        required: true,
        trim: true
      },
      address: {
        type: String,
        required: true,
        trim: true
      },
      city: {
        type: String,
        required: true,
        trim: true
      },
      state: {
        type: String,
        required: true,
        trim: true
      },
      pincode: {
        type: String,
        required: true,
        trim: true
      },
      country: {
        type: String,
        required: true,
        trim: true,
        default: 'India'
      }
    },
    required: true
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shipping: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  payment_method: {
    type: String,
    required: true,
    enum: ['COD', 'Online'],
    default: 'COD'
  },
  payment_status: {
    type: String,
    required: true,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  order_status: {
    type: String,
    required: true,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  stripe_payment_intent_id: {
    type: String,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Create indexes for better performance
orderSchema.index({ user_id: 1 });
orderSchema.index({ created_at: -1 });
orderSchema.index({ order_status: 1 });
orderSchema.index({ payment_status: 1 });

// Pre-save middleware to update updated_at
orderSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Virtual for order number (for display purposes)
orderSchema.virtual('order_number').get(function() {
  return `SBX-${this._id.toString().slice(-8).toUpperCase()}`;
});

// Ensure virtual fields are serialized
orderSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);
