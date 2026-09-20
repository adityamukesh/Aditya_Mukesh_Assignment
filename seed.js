require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Parcel, Zone } = require('./models');

async function upsertUser(data) {
    return User.findOneAndUpdate({ email: data.email }, { $setOnInsert: data }, { upsert: true, new: true, setDefaultsOnInsert: true });
}

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI);
    const admin = await upsertUser({ name: 'Aarav Mehta', email: 'admin@parcelpilot.io', password: await bcrypt.hash('admin123', 10), role: 'admin', phone: '+91 98765 43210', city: 'Pune' });
    const agent = await upsertUser({ name: 'Rohan Shah', email: 'agent@parcelpilot.io', password: await bcrypt.hash('agent123', 10), role: 'agent', phone: '+91 98111 77123', city: 'Pune', vehicle: 'MH 12 AB 4829', zone: 'Central Pune' });
    const customer = await upsertUser({ name: 'Maya Iyer', email: 'maya@parcelpilot.io', password: await bcrypt.hash('customer123', 10), role: 'customer', phone: '+91 98220 14141', city: 'Pune' });
    const zone = await Zone.findOneAndUpdate({ name: 'Central Pune' }, { $setOnInsert: { name: 'Central Pune', city: 'Pune' } }, { upsert: true, new: true });
    const existing = await Parcel.findOne({ trackingId: 'LLDEMO4829' });
    if (!existing) await Parcel.create({ trackingId: 'LLDEMO4829', customer: customer._id, assignedAgent: agent._id, sender: { name: 'Maya Iyer', phone: '+91 98220 14141' }, receiver: { name: 'Ananya Rao', phone: '+91 90000 10002' }, pickupAddress: '12 Koregaon Park, Pune', dropAddress: '45 Baner Road, Pune', weight: 1.4, parcelType: 'Document', zone: zone.name, status: 'In Transit', statusHistory: [{ status: 'Booked', note: 'Parcel booking created', updatedBy: admin._id }, { status: 'Picked Up', note: 'Collected from sender', updatedBy: agent._id }, { status: 'In Transit', note: 'Moving through Central Pune', updatedBy: agent._id }] });
    console.log('ParcelPilot seed complete. Existing data was preserved.');
    console.log('Admin: admin@parcelpilot.io / admin123');
    console.log('Agent: agent@parcelpilot.io / agent123');
    console.log('Customer: maya@parcelpilot.io / customer123');
    await mongoose.disconnect();
}
seed().catch((error) => { console.error(error.message); process.exit(1); });
