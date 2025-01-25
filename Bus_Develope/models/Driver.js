const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    workflowId: { type: String, required: false },
    status: { type: String, required: true },
    userDetails: { type: Object, required: false },
    results: { type: Array, required: false },
    processedAt: { type: Date, default: Date.now },
    attempts: { type: Number, required: false },
  });
  

const Driver = mongoose.model("Driver", DriverSchema);

module.exports = Driver;
