const { Parcel, User } = require('../models');
const { parcelStatuses } = require('../config/constants');
const { wantsJson } = require('../middleware/request');
const { flashRedirect } = require('../utils/response');

async function dashboard(req, res) {
    const parcels = await Parcel.find({ assignedAgent: req.session.user.id }).populate('customer', 'name phone').sort({ createdAt: -1 }).lean();
    res.render('agent', { title: 'Agent dashboard', parcels, parcelStatuses });
}

async function updateStatus(req, res) {
    const parcel = await Parcel.findOne({ _id: req.params.id, assignedAgent: req.session.user.id });
    if (!parcel) return res.status(404).json({ error: 'Assigned parcel not found.' });
    parcel.status = req.body.status;
    parcel.statusHistory.push({ status: req.body.status, note: req.body.note || `Status updated to ${req.body.status}`, updatedBy: req.session.user.id });
    await parcel.save();
    if (wantsJson(req)) return res.json({ message: 'Parcel status updated', parcel });
    flashRedirect(res, '/agent', 'success', 'Parcel status updated.');
}

module.exports = { dashboard, updateStatus };
