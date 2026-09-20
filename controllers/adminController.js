const bcrypt = require('bcryptjs');
const { User, Parcel, Zone } = require('../models');
const { parcelStatuses } = require('../config/constants');
const { wantsJson } = require('../middleware/request');
const { flashRedirect } = require('../utils/response');

async function overview(req, res) {
    const [parcels, agents, customers, zones] = await Promise.all([
        Parcel.find().populate('customer', 'name email').populate('assignedAgent', 'name phone zone').sort({ createdAt: -1 }).lean(),
        User.find({ role: 'agent', active: true }).sort({ name: 1 }).lean(),
        User.find({ role: 'customer' }).sort({ createdAt: -1 }).lean(),
        Zone.find({ active: true }).sort({ name: 1 }).lean()
    ]);
    res.render('admin', { title: 'Operations dashboard', parcels, agents, customers, zones, parcelStatuses, success: req.query.success, stats: { total: parcels.length, transit: parcels.filter((p) => ['Picked Up', 'In Transit', 'Out for Delivery'].includes(p.status)).length, delivered: parcels.filter((p) => p.status === 'Delivered').length, failed: parcels.filter((p) => p.status === 'Failed').length } });
}

async function assignParcel(req, res) {
    const parcel = await Parcel.findByIdAndUpdate(req.params.id, { assignedAgent: req.body.agentId, zone: req.body.zone }, { new: true }).populate('assignedAgent', 'name');
    if (wantsJson(req)) return res.json({ message: 'Parcel assigned', parcel });
    flashRedirect(res, '/admin', 'success', 'Parcel assigned to agent.');
}

async function createAgent(req, res) {
    const agent = await User.create({ name: req.body.name, email: req.body.email, password: await bcrypt.hash(req.body.password, 10), phone: req.body.phone, city: req.body.city, vehicle: req.body.vehicle, zone: req.body.zone, role: 'agent' });
    if (wantsJson(req)) return res.status(201).json({ message: 'Agent created', agent: { id: agent._id, name: agent.name, email: agent.email, zone: agent.zone } });
    flashRedirect(res, '/admin', 'success', 'Agent created.');
}

async function createZone(req, res) {
    const zone = await Zone.create({ name: req.body.name, city: req.body.city });
    if (wantsJson(req)) return res.status(201).json({ message: 'Zone created', zone });
    flashRedirect(res, '/admin', 'success', 'Delivery zone created.');
}

async function updateParcelStatus(req, res) {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel || !parcelStatuses.includes(req.body.status)) return res.status(400).json({ error: 'Invalid parcel or status.' });
    parcel.status = req.body.status;
    parcel.statusHistory.push({ status: req.body.status, note: req.body.note || `Admin updated status to ${req.body.status}`, updatedBy: req.session.user.id });
    await parcel.save();
    if (wantsJson(req)) return res.json({ message: 'Parcel status updated', parcel });
    flashRedirect(res, '/admin', 'success', 'Parcel status updated.');
}

module.exports = { overview, assignParcel, createAgent, createZone, updateParcelStatus };
