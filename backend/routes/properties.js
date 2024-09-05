const express = require("express");
const router = express.Router();
const Property = require("../models/property");

// Route to add a new property
router.post("/add", async (req, res) => {
  try {
    const newProperty = new Property(req.body);
    await newProperty.save();
    res.status(201).json({ message: "Property added successfully", property: newProperty });
  } catch (error) {
    res.status(500).json({ message: "Failed to add property", error });
  }
});

// Route to add a room category to an existing property
router.post("/add/:propertyId", async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { category, roomType, roomPrice } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.roomCategories.push({ category, roomType, roomPrice });
    await property.save();

    res.status(201).json({ message: "Room category added successfully", property });
  } catch (error) {
    res.status(500).json({ message: "Failed to add room category", error });
  }
});

// Fetch all properties
router.get("/get", async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch properties", error });
  }
});

// Fetch a single property by ID
router.get("/get/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch property", error });
  }
});

// Fetch a property by name
router.get('/getHotel/:hotelName', async (req, res) => {
  const {hotelName} = req.params;

  try {
    const hotel = await Property.findOne({ name: hotelName });
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hotel data', error });
  }
});




// Update a property by ID
router.put("/update/:Id", async (req, res) => {
  try {
    const { Id } = req.params;
    const updatedProperty = await Property.findByIdAndUpdate(Id, req.body, { new: true });
    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json({ message: "Property updated successfully", property: updatedProperty });
  } catch (error) {
    res.status(500).json({ message: "Failed to update property", error });
  }
});

// Delete a property by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const { propertyId } = req.params;
    const deletedProperty = await Property.findByIdAndDelete(propertyId);
    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete property", error });
  }
});

module.exports = router;
