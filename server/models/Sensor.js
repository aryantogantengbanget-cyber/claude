const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['rover', 'drone', 'stationary'],
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  location: {
    type: String,
    required: true
  },
  readings: [{
    temperature: Number,
    humidity: Number,
    soilMoisture: Number,
    lightIntensity: Number,
    pH: Number,
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Sensor', sensorSchema);
