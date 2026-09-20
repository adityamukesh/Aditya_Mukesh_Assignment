const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['donor', 'admin'], default: 'donor' },
  phone: String,
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  lastDonation: Date,
  city: String,
  createdAt: { type: Date, default: Date.now }
});

const inventorySchema = new mongoose.Schema({
  bloodGroup: { type: String, required: true, unique: true },
  units: { type: Number, default: 0, min: 0 },
  target: { type: Number, default: 25 },
  updatedAt: { type: Date, default: Date.now }
});

const requestSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  hospital: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  units: { type: Number, required: true, min: 1 },
  urgency: { type: String, enum: ['Routine', 'Urgent', 'Critical'], default: 'Urgent' },
  status: { type: String, enum: ['Pending', 'Processing', 'Fulfilled'], default: 'Pending' },
  contact: String,
  note: String,
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Inventory: mongoose.model('Inventory', inventorySchema),
  BloodRequest: mongoose.model('BloodRequest', requestSchema)
};
