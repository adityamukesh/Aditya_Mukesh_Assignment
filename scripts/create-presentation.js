const pptxgen = require('pptxgenjs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'LifeLink Project';
pptx.subject = 'Blood Donation and Blood Bank Management System';
pptx.title = 'LifeLink | Blood Donation & Blood Bank Management';
pptx.company = 'LifeLink';
pptx.lang = 'en-US';
pptx.theme = {
    headFontFace: 'Aptos Display',
    bodyFontFace: 'Aptos',
    lang: 'en-US'
};
pptx.defineSlideMaster({
    title: 'MASTER',
    background: { color: 'F6F2EC' },
    objects: [
        { line: { x: 0.55, y: 7.08, w: 12.2, h: 0, line: { color: 'DED8D0', width: 0.7 } } },
        { text: { text: 'LIFELINK  /  BLOOD DONATION & BLOOD BANK MANAGEMENT', options: { x: 0.6, y: 7.16, w: 7, h: 0.18, fontFace: 'Aptos', fontSize: 7, bold: true, color: '9B9189', charSpacing: 1.2, margin: 0 } } },
        { text: { text: '2026', options: { x: 11.9, y: 7.16, w: 0.7, h: 0.18, fontFace: 'Aptos', fontSize: 7, color: '9B9189', align: 'right', margin: 0 } } }
    ],
    slideNumber: { x: 12.55, y: 7.16, color: '9B9189', fontFace: 'Aptos', fontSize: 7 }
});

const C = { paper: 'F6F2EC', ink: '20211F', muted: '77736D', line: 'DED8D0', red: 'A9372D', peach: 'EAD5C9', green: '46755C', white: 'FFFFFF', darkPeach: 'D6B5A7' };
const addText = (slide, text, x, y, w, h, opts = {}) => slide.addText(text, { x, y, w, h, margin: 0, fontFace: opts.fontFace || 'Aptos', fontSize: opts.fontSize || 16, color: opts.color || C.ink, bold: opts.bold || false, italic: opts.italic || false, breakLine: false, fit: 'shrink', valign: opts.valign || 'mid', align: opts.align || 'left', paraSpaceAfterPt: opts.paraSpaceAfterPt || 0, bullet: opts.bullet, charSpacing: opts.charSpacing || 0 });
const title = (slide, kicker, heading, detail) => { addText(slide, kicker.toUpperCase(), 0.7, 0.55, 4.5, 0.25, { fontSize: 9, bold: true, color: C.red, charSpacing: 2 }); addText(slide, heading, 0.7, 0.9, 8.8, 0.78, { fontSize: 29, bold: true }); if (detail) addText(slide, detail, 0.72, 1.78, 8.8, 0.35, { fontSize: 12, color: C.muted }); };
const card = (slide, x, y, w, h, fill = C.white) => slide.addShape(pptx.ShapeType.rect, { x, y, w, h, rectRadius: 0.04, fill: { color: fill }, line: { color: fill } });
const pill = (slide, text, x, y, w, color = C.peach, textColor = C.red) => { slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h: 0.32, rectRadius: 0.08, fill: { color }, line: { color } }); addText(slide, text, x, y + 0.01, w, 0.26, { fontSize: 8, bold: true, color: textColor, align: 'center' }); };
const bulletList = (slide, items, x, y, w, gap = 0.43) => items.forEach((item, i) => { slide.addShape(pptx.ShapeType.ellipse, { x, y: y + i * gap + 0.11, w: 0.11, h: 0.11, fill: { color: C.red }, line: { color: C.red } }); addText(slide, item, x + 0.25, y + i * gap, w - 0.25, 0.3, { fontSize: 13, color: C.ink }); });

// 1. Cover
{
    const s = pptx.addSlide(); s.background = { color: C.ink };
    s.addShape(pptx.ShapeType.arc, { x: 7.1, y: -0.65, w: 6.2, h: 7.3, adjustPoint: 0.25, rotate: 18, line: { color: C.red, width: 1.2, transparency: 25 }, fill: { color: C.ink, transparency: 100 } });
    s.addShape(pptx.ShapeType.ellipse, { x: 8.35, y: 1.2, w: 3.9, h: 3.9, fill: { color: C.red, transparency: 6 }, line: { color: C.red, transparency: 100 } });
    s.addShape(pptx.ShapeType.ellipse, { x: 8.9, y: 1.75, w: 2.8, h: 2.8, fill: { color: C.darkPeach, transparency: 18 }, line: { color: C.darkPeach, transparency: 100 } });
    addText(s, '+', 0.78, 0.65, 0.45, 0.45, { fontFace: 'Georgia', fontSize: 26, bold: true, color: C.white, align: 'center' }); addText(s, 'lifelink.', 1.35, 0.68, 1.7, 0.35, { fontSize: 16, bold: true, color: C.white });
    addText(s, 'PS 4  /  HEALTHCARE + SOCIAL GOOD', 0.82, 2.04, 4.4, 0.3, { fontSize: 10, bold: true, color: C.darkPeach, charSpacing: 2 });
    addText(s, 'Give blood.\nGive tomorrow.', 0.78, 2.52, 7.3, 1.75, { fontSize: 39, bold: true, color: C.white });
    addText(s, 'Blood donation and blood bank management system', 0.82, 4.55, 6, 0.4, { fontSize: 16, color: 'D4CCC5' });
    addText(s, 'A server-rendered platform connecting donors, blood banks, and emergency requests in one clear workflow.', 0.82, 5.18, 5.9, 0.6, { fontSize: 12, color: 'A9A39D' });
    addText(s, 'LIFELINK  /  PROJECT PRESENTATION', 0.82, 6.65, 4.5, 0.22, { fontSize: 8, bold: true, color: C.darkPeach, charSpacing: 1.5 });
}

// 2. Problem
{
    const s = pptx.addSlide('MASTER'); title(s, '01  /  The challenge', 'When every minute matters.', 'Emergency blood coordination is often fragmented, slow, and difficult to verify.');
    card(s, 0.7, 2.35, 3.7, 3.5, C.white); addText(s, '01', 0.98, 2.66, 0.5, 0.3, { fontSize: 12, bold: true, color: C.red }); addText(s, 'Scattered information', 0.98, 3.16, 2.9, 0.4, { fontSize: 20, bold: true }); addText(s, 'Donor records, stock counts, and hospital requests live in disconnected channels.', 0.98, 3.78, 2.9, 0.9, { fontSize: 13, color: C.muted });
    card(s, 4.65, 2.35, 3.7, 3.5, C.peach); addText(s, '02', 4.93, 2.66, 0.5, 0.3, { fontSize: 12, bold: true, color: C.red }); addText(s, 'No live visibility', 4.93, 3.16, 2.9, 0.4, { fontSize: 20, bold: true }); addText(s, 'Teams cannot quickly see which groups are available or running low.', 4.93, 3.78, 2.9, 0.9, { fontSize: 13, color: '6D5B54' });
    card(s, 8.6, 2.35, 3.7, 3.5, C.ink); addText(s, '03', 8.88, 2.66, 0.5, 0.3, { fontSize: 12, bold: true, color: C.darkPeach }); addText(s, 'Trust and timing', 8.88, 3.16, 2.9, 0.4, { fontSize: 20, bold: true, color: C.white }); addText(s, 'A request needs a clear status, a responsible team, and an auditable record.', 8.88, 3.78, 2.9, 0.9, { fontSize: 13, color: 'B5ADA6' });
}

// 3. Solution
{
    const s = pptx.addSlide('MASTER'); title(s, '02  /  The solution', 'One connected circle of care.', 'LifeLink makes donation, inventory, and emergency response part of one shared system.');
    const steps = [['DONOR', 'Registers with blood group, city, and last donation date.'], ['BANK', 'Maintains live units and spots low-stock groups.'], ['REQUEST', 'Captures the patient, hospital, urgency, and units needed.'], ['RESPONSE', 'Moves every request from Pending to Processing to Fulfilled.']];
    steps.forEach((step, i) => { const x = 0.85 + i * 3.05; if (i < 3) s.addShape(pptx.ShapeType.line, { x: x + 2.25, y: 3.67, w: 0.68, h: 0, line: { color: C.red, width: 1.2, beginArrowType: 'none', endArrowType: 'triangle' } }); s.addShape(pptx.ShapeType.ellipse, { x, y: 2.72, w: 1.9, h: 1.9, fill: { color: i === 3 ? C.ink : C.peach }, line: { color: i === 3 ? C.ink : C.peach } }); addText(s, `0${i + 1}`, x, 3.08, 1.9, 0.25, { fontSize: 11, bold: true, color: i === 3 ? C.darkPeach : C.red, align: 'center' }); addText(s, step[0], x - 0.35, 4.85, 2.6, 0.3, { fontSize: 12, bold: true, color: C.red, align: 'center', charSpacing: 1 }); addText(s, step[1], x - 0.35, 5.25, 2.6, 0.65, { fontSize: 11, color: C.muted, align: 'center' }); });
}

// 4. Roles/features
{
    const s = pptx.addSlide('MASTER'); title(s, '03  /  Product scope', 'Built around two real users.', 'Simple permissions keep the donor experience focused and the operations view accountable.');
    card(s, 0.8, 2.35, 5.65, 3.65, C.white); pill(s, 'DONOR', 1.15, 2.75, 1.05); addText(s, 'Give with confidence.', 1.15, 3.32, 4.5, 0.45, { fontSize: 23, bold: true }); bulletList(s, ['Create an account and save donor profile data', 'View blood inventory by blood group', 'Check 90-day donation eligibility', 'Submit and track emergency blood requests'], 1.15, 4.05, 4.8, 0.4);
    card(s, 6.8, 2.35, 5.65, 3.65, C.ink); pill(s, 'ADMIN / BLOOD BANK', 7.15, 2.75, 1.8, C.red, C.white); addText(s, 'Keep the system moving.', 7.15, 3.32, 4.5, 0.45, { fontSize: 23, bold: true, color: C.white }); bulletList(s, ['Review donor records and active requests', 'Create or update units by blood group', 'Identify low-stock groups at a glance', 'Move requests through their fulfillment lifecycle'], 7.15, 4.05, 4.8, 0.4);
}

// 5. Architecture
{
    const s = pptx.addSlide('MASTER'); title(s, '04  /  Technical architecture', 'A lightweight server-rendered stack.', 'The system favors dependable primitives, clear ownership, and fast local development.');
    const blocks = [['EJS', 'Server-side rendered views\nShared partials + forms'], ['EXPRESS', 'Routes + middleware\nRole-based access'], ['MONGODB ATLAS', 'Persistent records\nUsers, inventory, requests'], ['SESSION', 'connect-mongo\nSecure login state']];
    blocks.forEach((b, i) => { const x = 0.8 + (i % 2) * 6.05; const y = 2.55 + Math.floor(i / 2) * 1.75; card(s, x, y, 5.4, 1.25, i === 2 ? C.peach : C.white); addText(s, b[0], x + 0.25, y + 0.22, 2.2, 0.28, { fontSize: 11, bold: true, color: C.red, charSpacing: 1 }); addText(s, b[1], x + 0.25, y + 0.57, 4.7, 0.45, { fontSize: 13, color: C.muted }); });
    addText(s, 'Browser / Postman', 4.9, 6.18, 2.1, 0.25, { fontSize: 11, bold: true, color: C.red, align: 'center' }); addText(s, '→', 7.03, 6.16, 0.45, 0.25, { fontSize: 18, bold: true, color: C.red, align: 'center' }); addText(s, 'Express application', 7.5, 6.18, 2.1, 0.25, { fontSize: 11, bold: true, color: C.ink, align: 'center' });
}

// 6. Data model
{
    const s = pptx.addSlide('MASTER'); title(s, '05  /  Data design', 'Four collections, one source of truth.', 'MongoDB collections map directly to the core workflows.');
    const collections = [['users', 'name\nemail\npassword hash\nrole\nbloodGroup\nlastDonation\ncity'], ['inventories', 'bloodGroup\nunits\ntarget\nupdatedAt'], ['bloodrequests', 'patientName\nhospital\nbloodGroup\nunits\nurgency\nstatus'], ['sessions', 'session cookie\nlogin state\nexpiry']];
    collections.forEach((c, i) => { const x = 0.75 + i * 3.05; card(s, x, 2.55, 2.7, 3.45, i === 1 ? C.peach : C.white); addText(s, c[0], x + 0.23, 2.88, 2.2, 0.3, { fontSize: 17, bold: true, color: C.red }); addText(s, c[1], x + 0.23, 3.55, 2.2, 1.9, { fontSize: 12, color: C.muted, breakLine: true }); });
    addText(s, 'Relationships: request → requester (User)  |  inventory → blood group  |  session → authenticated user', 0.8, 6.35, 11.6, 0.3, { fontSize: 11, color: C.muted, italic: true, align: 'center' });
}

// 7. Auth workflow
{
    const s = pptx.addSlide('MASTER'); title(s, '06  /  Authentication', 'Login is a session, not a leap of faith.', 'Passwords are hashed; the browser receives a session cookie, not the password.');
    const flow = [['01', 'REGISTER', 'User submits profile'], ['02', 'HASH', 'bcrypt protects password'], ['03', 'SESSION', 'connect-mongo stores login'], ['04', 'AUTHORIZE', 'middleware checks role']];
    flow.forEach((f, i) => { const x = 0.8 + i * 3.05; s.addShape(pptx.ShapeType.ellipse, { x, y: 2.65, w: 0.72, h: 0.72, fill: { color: i === 3 ? C.ink : C.peach }, line: { color: i === 3 ? C.ink : C.peach } }); addText(s, f[0], x, 2.88, 0.72, 0.2, { fontSize: 10, bold: true, color: i === 3 ? C.white : C.red, align: 'center' }); addText(s, f[1], x - 0.15, 3.8, 1.1, 0.25, { fontSize: 10, bold: true, color: C.red, align: 'center', charSpacing: 1 }); addText(s, f[2], x - 0.65, 4.28, 2, 0.5, { fontSize: 12, color: C.muted, align: 'center' }); if (i < 3) addText(s, '→', x + 1.6, 2.87, 0.5, 0.3, { fontSize: 18, color: C.red, align: 'center' }); });
    card(s, 2.1, 5.45, 9.7, 0.62, C.ink); addText(s, 'Protected admin actions require a valid connect.sid session and role = admin.', 2.35, 5.64, 9.2, 0.24, { fontSize: 12, color: C.white, align: 'center', bold: true });
}

// 8. Workflows/API
{
    const s = pptx.addSlide('MASTER'); title(s, '07  /  Workflows', 'From Postman request to Atlas document.', 'The same endpoints power the EJS interface and API-style testing.');
    const rows = [['AUTH', 'POST /register', 'Creates a user + session'], ['AUTH', 'POST /login', 'Verifies credentials + session'], ['DONOR', 'POST /request', 'Creates an emergency request'], ['ADMIN', 'POST /admin/inventory', 'Upserts stock by blood group'], ['ADMIN', 'POST /admin/requests/:id/status', 'Updates lifecycle status']];
    rows.forEach((r, i) => { const y = 2.35 + i * 0.68; if (i % 2 === 0) card(s, 0.8, y - 0.05, 11.6, 0.55, C.white); pill(s, r[0], 1.05, y + 0.08, 1.15, r[0] === 'ADMIN' ? C.ink : C.peach, r[0] === 'ADMIN' ? C.white : C.red); addText(s, r[1], 2.65, y + 0.09, 3.8, 0.25, { fontSize: 12, bold: true, color: C.ink }); addText(s, r[2], 7.2, y + 0.09, 4.5, 0.25, { fontSize: 12, color: C.muted }); });
}

// 9. Eligibility
{
    const s = pptx.addSlide('MASTER'); title(s, '08  /  Stretch goal delivered', 'Eligibility is built into the experience.', 'LifeLink calculates the recommended 90-day gap from the donor’s last donation date.');
    card(s, 0.8, 2.5, 4.25, 3.4, C.green); addText(s, '90', 1.15, 3.0, 1.5, 0.8, { fontSize: 48, bold: true, color: C.white }); addText(s, 'days', 2.62, 3.33, 1.1, 0.3, { fontSize: 17, bold: true, color: C.darkPeach }); addText(s, 'recommended gap\nbetween donations', 1.15, 4.2, 2.5, 0.6, { fontSize: 15, color: C.white });
    card(s, 5.45, 2.5, 6.35, 3.4, C.white); addText(s, 'Eligibility logic', 5.8, 2.9, 2.5, 0.3, { fontSize: 18, bold: true }); bulletList(s, ['No previous donation date → eligible', '90 or more days elapsed → eligible', 'Less than 90 days → show remaining wait', 'Status is visible on the donor dashboard'], 5.8, 3.55, 5.4, 0.46);
}

// 10. Testing/deployment
{
    const s = pptx.addSlide('MASTER'); title(s, '09  /  Delivery', 'Ready to test, demo, and deploy.', 'The project includes a clear local workflow and a path to production hosting.');
    card(s, 0.8, 2.4, 5.5, 3.7, C.white); addText(s, 'Local testing', 1.15, 2.8, 2.4, 0.3, { fontSize: 20, bold: true }); bulletList(s, ['npm install', 'npm run seed  (demo data only)', 'npm run dev', 'Postman with Desktop Agent', 'MongoDB Atlas collections'], 1.15, 3.5, 4.5, 0.48);
    card(s, 6.7, 2.4, 5.5, 3.7, C.peach); addText(s, 'Deployment path', 7.05, 2.8, 2.8, 0.3, { fontSize: 20, bold: true }); bulletList(s, ['Set MONGODB_URI in hosting environment', 'Set a strong SESSION_SECRET', 'Deploy Node.js app to Render / AWS', 'Use HTTPS and restrict Atlas IP access', 'Rotate exposed development credentials'], 7.05, 3.5, 4.5, 0.48);
}

// 11. Closing
{
    const s = pptx.addSlide(); s.background = { color: C.red };
    addText(s, '+', 0.85, 0.8, 0.55, 0.55, { fontFace: 'Georgia', fontSize: 32, bold: true, color: C.white, align: 'center' }); addText(s, 'lifelink.', 1.55, 0.85, 1.8, 0.4, { fontSize: 18, bold: true, color: C.white });
    addText(s, 'A clear path\nfrom donor to\nsecond chance.', 0.85, 2.0, 6.8, 2.3, { fontSize: 37, bold: true, color: C.white });
    addText(s, 'Thank you', 0.85, 5.22, 2.2, 0.4, { fontSize: 19, italic: true, color: C.darkPeach });
    addText(s, 'Blood donation and blood bank management system', 0.85, 6.42, 5.5, 0.25, { fontSize: 10, color: 'F4D6C9', charSpacing: 1 });
    s.addShape(pptx.ShapeType.ellipse, { x: 8.1, y: 1.15, w: 3.9, h: 3.9, fill: { color: C.darkPeach, transparency: 20 }, line: { color: C.darkPeach, transparency: 100 } });
    s.addShape(pptx.ShapeType.ellipse, { x: 8.7, y: 1.75, w: 2.7, h: 2.7, fill: { color: C.red, transparency: 40 }, line: { color: C.white, transparency: 35, width: 1.1 } });
    addText(s, '♥', 9.5, 2.6, 1.1, 0.9, { fontFace: 'Georgia', fontSize: 45, color: C.white, align: 'center' });
}

pptx.writeFile({ fileName: 'LifeLink-Project-Presentation.pptx' });
