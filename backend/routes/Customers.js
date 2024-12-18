const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer'); // Adjust path as needed

// Create a new customer
router.post('/add', async (req, res) => {
  try {
    const { name, age, checkinDate, checkoutDate, email, contact, adultsOnBoard, childrenOnBoard, feechildrencount, noneFeeChildrenCount, hotelName, roomType, numberOfRooms, mealOptions, extraNotes, totalAmount } = req.body;

    // Create a new Customer instance with the provided data
    const newCustomer = new Customer({
      name,
      age,
      checkinDate,
      checkoutDate,
      email,
      contact,
      adultsOnBoard,
      childrenOnBoard,
      feechildrencount,
      noneFeeChildrenCount,
      hotelName,
      roomType,
      numberOfRooms,
      mealOptions,
      extraNotes,
      totalAmount
    });

    // Save the new customer to the database
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error saving customer data:', error);
    res.status(500).json({ message: 'Error saving customer data', error });
  }
});


// Get all customers
router.get('/get', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single customer by ID
router.get('/get/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a customer by ID
router.put('/update/:id', async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a customer by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
