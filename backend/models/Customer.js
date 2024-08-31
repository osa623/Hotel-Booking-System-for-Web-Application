const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 0 },
  checkinDate: { type: Date, required: true },
  checkoutDate: { type: Date, required: true },
  email: { type: String, required: true, trim: true },
  contact: { type: String, required: true, trim: true },
  adultsOnBoard: { type: Number, required: true, min: 0 }, // Number of adults
  childrenOnBoard: { type: Number, required: true, min: 0 }, // Number of children
  feechildrencount : { type: Number, required: true, min: 0 }, // Number of children above age limit 
  noneFeeChildrenCount : { type: Number, required: true, min: 0 },  // Number of children below age limit 
  roomType: { type: String, required: true, trim: true },
  numberOfRooms: { type: Number, required: true, min: 1 },
  mealOptions: [{ type: String, enum: ['breakfast', 'lunch', 'dinner'] }],
  extraNotes: { type: String, trim: true },
  totalAmount: { type: Number, required: true, min: 0 }
});

module.exports = mongoose.model('Customer', customerSchema);
