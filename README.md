# ParcelPilot

A server-rendered courier and parcel delivery tracking system built with Node.js, Express, EJS, MongoDB Atlas, and session-based authentication.

## Features

- Role-based authentication for customers, delivery agents, and admins
- Customer parcel booking with sender, receiver, address, weight, and parcel type details
- Unique tracking ID for every parcel
- Public shipment tracking page
- Timestamped status history for every parcel
- Delivery lifecycle: Booked, Picked Up, In Transit, Out for Delivery, Delivered, Failed
- Agent dashboard for assigned parcels and status updates
- Admin dashboard with total, in-transit, delivered, and failed parcel metrics
- Admin parcel assignment, agent management, and delivery zone management
- MongoDB Atlas persistence with MongoDB-backed sessions
- EJS server-side rendering and JSON responses for Postman testing
- Non-destructive courier demo seeding

## MVC structure

```text
config/          Database connection and constants
controllers/     Business logic for auth, customers, agents, and admins
middleware/      Authentication and database guards
models.js        User, Parcel, and Zone schemas
routes/          Public, auth, customer, agent, and admin routers
utils/           Shared response helpers
views/           EJS pages and partials
public/          CSS and browser JavaScript
server.js        Express composition root
```

## Run locally

```bash
npm install
npm run seed
npm run dev
```

Open `http://localhost:3000`.

Demo accounts:

- Admin: `admin@parcelpilot.io` / `admin123`
- Agent: `agent@parcelpilot.io` / `agent123`
- Customer: `maya@parcelpilot.io` / `customer123`

The seed script is non-destructive: it creates missing demo records and preserves existing application data.

## Environment

Create `.env` from `.env.example`:

```env
PORT=3000
MONGODB_URI=your-mongodb-atlas-uri
SESSION_SECRET=your-long-session-secret
NODE_ENV=development
```

For Render, use a **Web Service** with `npm install` as the build command and `npm start` as the start command. Add `MONGODB_URI`, `SESSION_SECRET`, and `NODE_ENV=production` in Render Environment Variables.
