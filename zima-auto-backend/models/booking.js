// models/booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true,
    enum: ['airportParking', 'carWash', 'autoService', 'tireService']
  },
  startDateTime: {
    type: Date,
    required: true
  },
  endDateTime: {
    type: Date,
    required: true
  },
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  licensePlate: String,
  carWashPackage: String,
  serviceType: String,
  carModel: String,
  tireCount: Number,
  notes: String,
  calendarEventId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
bookingSchema.index({ service: 1, startDateTime: 1, endDateTime: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;