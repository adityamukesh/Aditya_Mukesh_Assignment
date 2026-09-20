const crypto = require('crypto');
const { Parcel } = require('../models');
const { parcelTypes } = require('../config/constants');
const { wantsJson } = require('../middleware/request');
const { flashRedirect } = require('../utils/response');

function trackingId() { return `LL${crypto.randomBytes(4).toString('hex').toUpperCase()}`; }

async function dashboard(req, res) {
    const parcels = await Parcel.find({ customer: req.session.user.id }).populate('assignedAgent', 'name phone').sort({ createdAt: -1 }).lean();
    res.render('dashboard', { title: 'Customer dashboard', parcels, stats: { total: parcels.length, active: parcels.filter((p) => !['Delivered', 'Failed'].includes(p.status)).length, delivered: parcels.filter((p) => p.status === 'Delivered').length } });
}

function bookingPage(req, res) { res.render('request', { title: 'Book a parcel', parcelTypes, error: req.query.error }); }

async function bookParcel(req, res) {
    const parcel = await Parcel.create({
        trackingId: trackingId(), customer: req.session.user.id,
        sender: { name: req.body.senderName, phone: req.body.senderPhone },
        receiver: { name: req.body.receiverName, phone: req.body.receiverPhone },
        pickupAddress: req.body.pickupAddress, dropAddress: req.body.dropAddress,
        weight: Number(req.body.weight), parcelType: req.body.parcelType, zone: req.body.zone,
        statusHistory: [{ status: 'Booked', note: 'Parcel booking created', updatedBy: req.session.user.id }]
    });
    if (wantsJson(req)) return res.status(201).json({ message: 'Parcel booked successfully', parcel });
    res.redirect(`/track/${parcel.trackingId}`);
}

async function trackParcel(req, res) {
    const trackingIdValue = req.params.trackingId || req.query.trackingId;
    const parcel = await Parcel.findOne({ trackingId: trackingIdValue }).populate('assignedAgent', 'name phone vehicle').lean();
    if (!parcel) return res.status(404).render('error', { title: 'Tracking ID not found', message: 'Check the tracking ID and try again.' });
    if (wantsJson(req)) return res.json({ parcel });
    res.render('track', { title: `Track ${parcel.trackingId}`, parcel });
}

module.exports = { dashboard, bookingPage, bookParcel, trackParcel };
