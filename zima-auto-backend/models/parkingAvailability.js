// models/parkingAvailability.js
const mongoose = require('mongoose');

const parkingAvailabilitySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  availableSpots: {
    type: Number,
    default: 150 // Total number of parking spots
  }
});

// Index for efficient querying by date
parkingAvailabilitySchema.index({ date: 1 }, { unique: true });

const ParkingAvailability = mongoose.model('ParkingAvailability', parkingAvailabilitySchema);

module.exports = ParkingAvailability;