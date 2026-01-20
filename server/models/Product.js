const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['kakao', 'palm_oil', 'coconut', 'fertilizer', 'equipment', 'seeds'],
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'kg'
  },
  stock: {
    type: Number,
    default: 0
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [String],
  location: {
    province: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  quality: {
    type: String,
    enum: ['premium', 'grade_a', 'grade_b', 'grade_c'],
    default: 'grade_a'
  },
  certification: [String],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['active', 'sold', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
