require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Inventory, BloodRequest } = require('./models');

const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI);
    const password = await bcrypt.hash('admin123', 10);
    const admin = await User.findOneAndUpdate(
        { email: 'admin@lifelink.org' },
        { name: 'Aarav Mehta', email: 'admin@lifelink.org', password, role: 'admin', phone: '+91 98765 43210', city: 'Pune' },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const donorPassword = await bcrypt.hash('donor123', 10);
    const donor = await User.findOneAndUpdate(
        { email: 'maya@example.com' },
        { name: 'Maya Iyer', email: 'maya@example.com', password: donorPassword, role: 'donor', phone: '+91 98220 14141', city: 'Pune', bloodGroup: 'O+', lastDonation: new Date('2025-12-18') },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    await User.findOneAndUpdate(
        { email: 'rohan@example.com' },
        { name: 'Rohan Shah', email: 'rohan@example.com', password: donorPassword, role: 'donor', phone: '+91 98111 77123', city: 'Mumbai', bloodGroup: 'A+', lastDonation: new Date('2026-02-21') },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    await Promise.all(groups.map((bloodGroup, index) => Inventory.updateOne(
        { bloodGroup },
        { $setOnInsert: { bloodGroup, units: [42, 8, 27, 19, 12, 4, 36, 14][index], target: 25 } },
        { upsert: true }
    )));
    const demoRequests = [
        { patientName: 'Kabir Nair', hospital: 'Sahyadri Hospital', bloodGroup: 'O-', units: 3, urgency: 'Critical', status: 'Pending', contact: '+91 90000 10001', note: 'Surgery scheduled tonight', requester: donor._id },
        { patientName: 'Anaya Rao', hospital: 'Ruby Hall Clinic', bloodGroup: 'AB+', units: 2, urgency: 'Urgent', status: 'Processing', contact: '+91 90000 10002', requester: donor._id },
        { patientName: 'Dev Malhotra', hospital: 'KEM Hospital', bloodGroup: 'A+', units: 1, urgency: 'Routine', status: 'Fulfilled', contact: '+91 90000 10003', requester: admin._id }
    ];
    await Promise.all(demoRequests.map((request) => BloodRequest.updateOne(
        { patientName: request.patientName, hospital: request.hospital },
        { $setOnInsert: request },
        { upsert: true }
    )));
    console.log('Seed complete. Existing user data was preserved. Admin: admin@lifelink.org / admin123');
    await mongoose.disconnect();
}
seed().catch((error) => { console.error(error.message); process.exit(1); });
