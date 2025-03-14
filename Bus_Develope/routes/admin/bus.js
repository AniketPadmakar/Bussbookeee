const express = require("express");
const app = express();
app.use(express.json());
const axios = require("axios");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const fetchadmin = require("../../middleware/fetchadmin");
const router = express.Router();
const Admin = mongoose.model("Admin");
const Bus = mongoose.model("Bus");
const Ticket = mongoose.model("Ticket");
const Driver = mongoose.model("Driver");
dotenv.config(); // Load environment variables from .env file
const cors = require("cors");
app.use(cors({ origin: "*" })); // Allows requests from any origin

const { APP_ID, APP_KEY } = process.env;

// Add a new bus
router.post("/add-bus", fetchadmin, async (req, res) => {
  const adminId = req.user.id; // Admin ID from middleware
  const {
    busName,
    busNumber,
    operatorName,
    rate,
    date,
    timing,
    totalSeats,
    arrivalFrom,
    destination,
    frequency,
  } = req.body;

  try {
    // Validate required fields
    if (
      !busName ||
      !busNumber ||
      !rate ||
      !totalSeats ||
      !arrivalFrom ||
      !destination ||
      !frequency
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate admin existence
    const admin = await Admin.findById(adminId);
    // if (!admin) {
    //   return res.status(401).json({ error: "Unauthorized access. Admin not found" });
    // }//
    // Check if a bus with the same bus number already exists
    const existingBus = await Bus.findOne({
      busNumber,
      destination,
      arrivalFrom,
      date,
      timing,
    });
    if (existingBus) {
      return res
        .status(400)
        .json({ error: "Bus with this number already exists" });
    }

    // Create a new bus
    const bus = new Bus({
      busName,
      busNumber,
      operatorName,
      rate,
      date,
      timing,
      totalSeats,
      availableSeats: totalSeats,
      arrivalFrom,
      destination,
      frequency,
    });

    // Save the new bus
    const savedBus = await bus.save();

    // Link the new bus to the admin
    admin.buses.push(savedBus._id);
    await admin.save();

    res.status(201).json({ message: "Bus added successfully", bus: savedBus });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal server error while adding the bus" });
  }
});

// Update an existing bus
router.put("/update-bus", fetchadmin, async (req, res) => {
  const adminId = req.user.id; // Admin ID from middleware
  const {
    busId,
    busName,
    operatorName,
    rate,
    date,
    timing,
    totalSeats,
    arrivalFrom,
    destination,
    frequency,
  } = req.body;

  try {
    // Validate required fields
    if (!busId) {
      return res.status(400).json({ error: "Bus ID is required" });
    }

    // Find the bus to update
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    // List of updatable fields
    const updatableFields = [
      "busName",
      "operatorName",
      "rate",
      "date",
      "timing",
      "totalSeats",
      "arrivalFrom",
      "destination",
      "frequency",
    ];

    // Check if any field from req.body is updatable
    const fieldsToUpdate = Object.keys(req.body).filter((field) =>
      updatableFields.includes(field)
    );

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({
        error:
          "No valid fields provided for update. Please specify at least one field to update.",
      });
    }

    // Update bus details based on fields provided in the request body
    fieldsToUpdate.forEach((field) => {
      if (field === "totalSeats") {
        // Adjust available seats proportionally if totalSeats is changed
        const seatDifference = req.body[field] - bus.totalSeats;
        bus.availableSeats += seatDifference;
        bus.totalSeats = req.body[field];
      } else {
        bus[field] = req.body[field];
      }
    });

    // Save the updated bus
    const updatedBus = await bus.save();

    res
      .status(200)
      .json({ message: "Bus updated successfully", bus: updatedBus });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal server error while updating the bus" });
  }
});

// Get a specific bus by ID
router.get("/get-bus/:busId", fetchadmin, async (req, res) => {
  const { busId } = req.params; // Extract busId from request parameters

  try {
    // Validate if busId is provided
    if (!busId) {
      return res.status(400).json({ error: "Bus ID is required" });
    }

    // Find the bus by ID
    const bus = await Bus.findById(busId);

    // Check if the bus exists
    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    // Return the bus details
    res.status(200).json({ bus });
  } catch (error) {
    console.error("Error fetching bus details:", error);
    res.status(500).json({ error: "Internal server error while fetching bus details" });
  }
});

router.get("/view-buses", fetchadmin, async (req, res) => {
  const id = req.user.id; // Admin ID from params

  try {
    // Validate admin existence
    const admin = await Admin.findById(id).populate("buses");
    // if (!admin) {
    //   return res.status(404).json({ error: "Admin not found" });
    // }
    res.status(200).json({ buses: admin.buses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching buses" });
  }
});

router.post("/delete-a-bus", fetchadmin, async (req, res) => {
  const id = req.user.id; // Admin ID from params
  const { busId } = req.body; // Bus ID from frontend

  try {
    if (!busId) {
      return res.status(400).json({ error: "Bus ID is required" });
    }

    const admin = await Admin.findById(id);
    // if (!admin) {
    //   return res
    //     .status(401)
    //     .json({ error: "Unauthorized access. Admin not found" });
    // }
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    // Remove the bus from the admin's buses array
    admin.buses = admin.buses.filter((bus) => bus.toString() !== busId);
    await admin.save();

    // Delete the bus document
    await Bus.findByIdAndDelete(busId);

    res.status(200).json({ message: "Bus deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while deleting the bus" });
  }
});

// Get seat bookings for a specific bus along with user details
// router.post("/seat-bookings", fetchadmin, async (req, res) => {
//   const { busId } = req.body; // Bus ID from request params

//   try {
//     // Validate the bus existence
//     const bus = await Bus.findById(busId);
//     if (!bus) {
//       return res.status(404).json({ error: "Bus not found" });
//     }

//     // Populate tickets and include user details
//     const tickets = await Ticket.find({ busId }).populate({
//       path: "user", // Assuming there is a reference to the user in Ticket schema
//       select: "firstName lastName email", // Only include specific user fields
//     });

//     // If no tickets are booked
//     if (tickets.length === 0) {
//       return res
//         .status(200)
//         .json({ message: "No tickets booked for this bus yet", bookings: [] });
//     }

//     // Format the response
//     const bookings = tickets.map((ticket) => ({
//       seatNumber: ticket.seatNumber,
//       user: ticket.user,
//     }));

//     res
//       .status(200)
//       .json({ message: "Seat bookings retrieved successfully", bookings });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "Internal server error while fetching seat bookings" });
//   }
// });

router.post('/view-tickets', async (req, res) => {
  try {
      const { busId } = req.body;

      // Validate input
      if (!busId) {
          return res.status(400).json({ message: 'busId is required' });
      }

      // Find the bus by its ID
      const bus = await Bus.findById(busId).populate('tickets');

      if (!bus) {
          return res.status(404).json({ message: 'Bus not found' });
      }

      // Respond with the tickets data
      res.status(200).json({
          message: 'Tickets fetched successfully',
          tickets: bus.tickets
      });
  } catch (error) {
      console.error('Error fetching tickets:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Route to generate an access token
router.post("/generate-access-token", async (req, res) => {
  try {
    const { expiry = 300 } = req.body; // Expiry in seconds, default to 5 minutes if not provided

    // Validate expiry value
    if (expiry < 1 || expiry > 86400) {
      return res
        .status(400)
        .json({ error: "Invalid expiry value. It must be between 1 and 86400 seconds." });
    }

    // Make the API call to generate the access token
    const response = await axios.post(
      "https://auth.hyperverge.co/login",
      {
        appId: APP_ID,
        appKey: APP_KEY,
        expiry,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Return the generated token in the response
    res.status(200).json({
      message: "Access token generated successfully",
      token: response.data.result.token,
    });
  } catch (error) {
    console.error("Error generating access token:", error.message);

    // Handle errors
    if (error.response && error.response.data) {
      return res.status(error.response.status).json({
        error: error.response.data.error || "Error generating access token",
      });
    }

    res.status(500).json({
      error: "Internal server error while generating access token",
    });
  }
});


router.post("/submit-kyc", async (req, res) => {
  try {
    //console.log("Incoming request body:", req.body);

    const { transactionId, status, details } = req.body;

    // Validate required fields
    if (!transactionId || !status) {
      return res.status(400).json({ message: "Invalid data received: Missing required fields (transactionId, status)" });
    }

    const requestBody = { transactionId };

    // Call HyperVerge Logs API
    const response = await axios.post(
      "https://ind.idv.hyperverge.co/v1/link-kyc/results",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          appId: process.env.APP_ID,
          appKey: process.env.APP_KEY,
        },
      }
    );

    //console.log("Response from HyperVerge API:", response.data);

    // Validate the response structure
    if (!response.data || !response.data.result) {
      return res.status(500).json({
        message: "Invalid response structure from HyperVerge API",
        details: response.data || "No response data",
      });
    }

    const logData = response.data.result;

    // Safely access metadata and transactionId
    const metadata = logData.metadata || {};
    const transactionIdFromResponse = metadata.transactionId || "N/A";

    const newDriver = new Driver({
      transactionId: transactionIdFromResponse,
      workflowId: logData.workflowDetails?.workflowId || "N/A",
      status: logData.applicationStatus || "Unknown",
      userDetails: logData.userDetails || {},
      results: logData.results || [],
      processedAt: logData.processedAt || new Date(),
      attempts: logData.results?.length || 0,
    });

    //console.log("New Driver object to be saved:", newDriver);

    await newDriver.save().catch((error) => {
      console.error("Error saving to the database:", error.message);
      throw error; // Re-throw the error for consistent error handling
    });

    res.status(200).json({ message: "Logs fetched and saved successfully", newDriver });
  } catch (error) {
    console.error("Error fetching logs:", error.message, error.response?.data || {});
    res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
  }
});

module.exports = router;
