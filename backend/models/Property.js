const mongoose = require("mongoose");

// Define the Room Category Schema
const roomCategorySchema = new mongoose.Schema({
  roomType: { type: String, required: true }, // Room Type
  roomPrice: { type: Number, required: true }, // Room Price
  people_count: { type: Number, required: true } // people count
});

// Define the Property Schema
const propertySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Property Name
  type: { type: String, required: true }, // Property Type (Apartment, Hotel, Home Stay, Villa, etc.)
  location: { type: String, required: true }, // Location
  description: { type: String, required: true }, // Description
  chargesPerHead: { type: Number, required: true }, // Charges Per Head
  winterSupplement: { type: Number }, // Winter Supplement
  summerSupplement: { type: Number }, // Summer Supplement
  ageLimitComplimentaryStay: { type: Number }, // Age Limit for Complimentary Stay for Children
  ageLimitChildPricing: { type: Number }, // Age Limit for Child Pricing Policy
  childSupplement: { type: Number }, // Child Supplement
  breakfastSupplement: { type: Number }, // Breakfast Supplement
  lunchSupplement: { type: Number }, // Lunch Supplement
  dinnerSupplement: { type: Number }, // Dinner Supplement
  roomCategories: [roomCategorySchema], // Array of Room Categories
  additionalCharges: { type: Number },
  photos: [{ type: String }], // URLs or paths of photos
});

// Create the Property model
const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
