const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'agent', 'admin', 'donor'], default: 'customer' },
    phone: String,
    city: String,
    vehicle: String,
    zone: String,
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const statusHistorySchema = new mongoose.Schema({
    status: { type: String, enum: ['Booked', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed'], required: true },
    note: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
}, { _id: false });

const parcelSchema = new mongoose.Schema({
    trackingId: { type: String, required: true, unique: true, index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { name: String, phone: String },
    receiver: { name: String, phone: String },
    pickupAddress: { type: String, required: true },
    dropAddress: { type: String, required: true },
    weight: { type: Number, required: true, min: 0.1 },
    parcelType: { type: String, enum: ['Document', 'Box', 'Fragile', 'Electronics', 'Other'], default: 'Box' },
    zone: String,
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Booked', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed'], default: 'Booked' },
    statusHistory: { type: [statusHistorySchema], default: [] },
    createdAt: { type: Date, default: Date.now }
});

const zoneSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    city: String,
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = {
    User: mongoose.model('User', userSchema),
    Parcel: mongoose.model('Parcel', parcelSchema),
    Zone: mongoose.model('Zone', zoneSchema)
};
