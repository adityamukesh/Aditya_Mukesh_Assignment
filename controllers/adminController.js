const { Inventory, BloodRequest, User } = require('../models');
const { wantsJson } = require('../middleware/request');
const { flashRedirect } = require('../utils/response');

async function overview(req, res) {
    const [inventory, requests, donors] = await Promise.all([
        Inventory.find().sort({ units: 1 }).lean(),
        BloodRequest.find().populate('requester', 'name email').sort({ createdAt: -1 }).lean(),
        User.find({ role: 'donor' }).sort({ createdAt: -1 }).lean()
    ]);
    res.render('admin', {
        title: 'Operations overview', inventory, requests, donors,
        activeRequests: requests.filter((item) => item.status !== 'Fulfilled'),
        lowStock: inventory.filter((item) => item.units < item.target),
        success: req.query.success
    });
}

async function saveInventory(req, res) {
    const inventory = await Inventory.findOneAndUpdate(
        { bloodGroup: req.body.bloodGroup },
        { $set: { units: Number(req.body.units), target: Number(req.body.target || 25), updatedAt: new Date() }, $setOnInsert: { bloodGroup: req.body.bloodGroup } },
        { upsert: true, new: true, runValidators: true }
    );
    if (wantsJson(req)) return res.status(200).json({ message: 'Inventory saved', inventory });
    flashRedirect(res, '/admin', 'success', 'Inventory saved.');
}

async function updateInventory(req, res) {
    await Inventory.findByIdAndUpdate(req.params.id, { units: Number(req.body.units), updatedAt: new Date() });
    flashRedirect(res, '/admin', 'success', 'Inventory updated.');
}

async function updateRequestStatus(req, res) {
    await BloodRequest.findByIdAndUpdate(req.params.id, { status: req.body.status });
    flashRedirect(res, '/admin', 'success', 'Request status updated.');
}

async function donors(req, res) {
    const donorList = await User.find({ role: 'donor' }).sort({ createdAt: -1 }).lean();
    res.render('donors', { title: 'Donor directory', donors: donorList });
}

module.exports = { overview, saveInventory, updateInventory, updateRequestStatus, donors };
