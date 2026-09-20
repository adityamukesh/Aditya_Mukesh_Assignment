const mongoose = require('mongoose');

async function connectDatabase() {
    if (!process.env.MONGODB_URI) {
        console.warn('MONGODB_URI is missing. Public pages work; database features are disabled.');
        return false;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas');
        return true;
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        return false;
    }
}

function isDatabaseReady() {
    return mongoose.connection.readyState === 1;
}

module.exports = { connectDatabase, isDatabaseReady };
