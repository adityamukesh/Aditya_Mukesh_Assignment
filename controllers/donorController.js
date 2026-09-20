const { Inventory, BloodRequest, User } = require('../models');
const { groups } = require('../config/constants');
const { wantsJson } = require('../middleware/request');
const { flashRedirect } = require('../utils/response');

function daysSince(date) {
    return date ? Math.floor((Date.now() - new Date(date).getTime()) / 86400000) : null;
}

function isEligible(date) {
    return !date || daysSince(date) >= 90;
}

async function dashboard(req, res) {
    const [inventory, requests, donor] = await Promise.all([
        Inventory.find().sort({ bloodGroup: 1 }).lean(),
        BloodRequest.find({ requester: req.session.user.id }).sort({ createdAt: -1 }).lean(),
        User.findById(req.session.user.id).lean()
    ]);
    res.render('dashboard', { title: 'Your dashboard', inventory, requests, donor, eligible: isEligible(donor.lastDonation), days: daysSince(donor.lastDonation), success: req.query.success });
}

async function search(req, res) {
    const selected = req.query.group || '';
    const inventory = await Inventory.find(selected ? { bloodGroup: selected } : {}).sort({ bloodGroup: 1 }).lean();
    res.render('search', { title: 'Find blood', inventory, groups, selected });
}

function requestPage(req, res) {
    res.render('request', { title: 'Request blood', groups, error: req.query.error, success: req.query.success });
}

async function createRequest(req, res) {
    const request = await BloodRequest.create({ ...req.body, requester: req.session.user.id, units: Number(req.body.units) });
    if (wantsJson(req)) return res.status(201).json({ message: 'Blood request submitted', request });
    flashRedirect(res, '/dashboard', 'success', 'Your request has been sent to the blood bank.');
}

module.exports = { dashboard, search, requestPage, createRequest };
