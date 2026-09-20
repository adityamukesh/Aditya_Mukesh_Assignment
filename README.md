# LifeLink Blood Bank

A server-rendered blood donation and blood bank management system built with Node.js, Express, EJS, MongoDB Atlas, and session-based authentication.

## Run locally

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and add your MongoDB Atlas connection string.
3. Seed demo data: `npm run seed`
4. Start the app: `npm run dev`
5. Open `http://localhost:3000`

Demo accounts after seeding:

- Admin: `admin@lifelink.org` / `admin123`
- Donor: `maya@example.com` / `donor123`

Without MongoDB configured, the app still starts and shows the public landing page, but authenticated data features require the database connection.
# Aditya_Mukesh_Assignment
