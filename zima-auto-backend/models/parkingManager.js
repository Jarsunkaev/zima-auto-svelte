// utils/parkingManager.js
const ParkingAvailability = require('../models/parkingAvailability');

// Check parking availability for a date range
async function checkParkingAvailability(startDate, endDate) {
  // Convert input to Date objects if they're strings
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Get all dates between start and end
  const dates = getDatesInRange(start, end);
  
  // Check availability for each date
  const availabilityPromises = dates.map(async date => {
    const dateString = date.toISOString().split('T')[0];
    
    // Find or create availability record for this date
    let availability = await ParkingAvailability.findOne({
      date: {
        $gte: new Date(`${dateString}T00:00:00.000Z`),
        $lt: new Date(`${dateString}T23:59:59.999Z`)
      }
    });
    
    if (!availability) {
      availability = new ParkingAvailability({
        date: new Date(`${dateString}T12:00:00.000Z`) // Noon as reference time
      });
      // Don't save it yet, just create a temporary record for checking
    }
    
    return {
      date: dateString,
      available: availability.availableSpots > 0,
      spots: availability.availableSpots
    };
  });
  
  const availabilityResults = await Promise.all(availabilityPromises);
  
  // Return false if any date is fully booked
  const allAvailable = availabilityResults.every(result => result.available);
  
  return {
    available: allAvailable,
    dateAvailability: availabilityResults
  };
}

// Update parking availability after a successful booking
async function updateParkingAvailability(startDate, endDate) {
  // Convert input to Date objects if they're strings
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Get all dates between start and end
  const dates = getDatesInRange(start, end);
  
  // Update availability for each date
  for (const date of dates) {
    const dateString = date.toISOString().split('T')[0];
    
    // Find or create availability record
    let availability = await ParkingAvailability.findOne({
      date: {
        $gte: new Date(`${dateString}T00:00:00.000Z`),
        $lt: new Date(`${dateString}T23:59:59.999Z`)
      }
    });
    
    if (!availability) {
      availability = new ParkingAvailability({
        date: new Date(`${dateString}T12:00:00.000Z`)
      });
    }
    
    // Decrease available spots
    availability.availableSpots = Math.max(0, availability.availableSpots - 1);
    await availability.save();
  }
}

// Helper function to get array of dates between start and end (inclusive)
function getDatesInRange(startDate, endDate) {
  const dates = [];
  const currentDate = new Date(startDate);
  
  // Strip time component for consistent comparison
  currentDate.setHours(0, 0, 0, 0);
  const endDateNoTime = new Date(endDate);
  endDateNoTime.setHours(0, 0, 0, 0);
  
  // Loop through dates
  while (currentDate <= endDateNoTime) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

module.exports = {
  checkParkingAvailability,
  updateParkingAvailability
};