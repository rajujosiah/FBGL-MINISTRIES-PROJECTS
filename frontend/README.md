# FIRST BORN GOSPEL LIFE MINISTRIES Website

A React-based website for FIRST BORN GOSPEL LIFE MINISTRIES (Registration No: Reg. 17/2016) - Transforming Lives through Social, Economic & Educational Empowerment in Christ.

## Features

- **Home Page**: Hero banner, welcome message, vision & mission, key focus areas
- **Our Team**: Hierarchical team structure (Board Members → Area Managers → Project Managers → Social Workers)
- **Our Projects**: Project listing with filtering by category (Social, Economy, Education)
- **Contact**: Contact form and ministry information
- **Donate**: Donation form with payment integration options

## Technology Stack

- **React 19.2.0** - UI library
- **React Router DOM 6.21.1** - Routing
- **Supabase** - Backend database (with sample data fallback)
- **CSS3** - Styling with responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account (optional - app uses sample data if not configured)

### Installation

1. Clone the repository:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure Supabase (Optional):
   - Create a `.env` file in the `frontend` directory
   - Add your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   - See `SUPABASE_SETUP.md` for database schema setup
   - If not configured, the app will use sample data for testing

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Deployment to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables in Vercel dashboard:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
4. Deploy!

Or use Vercel CLI:
```bash
npm i -g vercel
vercel
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Header.css
│   │   ├── Footer.js
│   │   └── Footer.css
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Home.css
│   │   ├── OurTeam.js
│   │   ├── OurTeam.css
│   │   ├── Projects.js
│   │   ├── Projects.css
│   │   ├── Contact.js
│   │   ├── Contact.css
│   │   ├── Donate.js
│   │   └── Donate.css
│   ├── utils/
│   │   ├── supabase.js
│   │   ├── imageUtils.js
│   │   └── sampleData.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Team Hierarchy

The website supports a hierarchical team structure:

1. **Board Members** - Top-level leadership
2. **Area Managers** - Regional coordinators
   - ID Format: `FBGL [STATE] [DISTRICT] A[COUNT]`
   - Example: `FBGL AP EG A01` (Andhra Pradesh, East Godavari, Area Manager #01)
3. **Project Managers** - Reporting to Area Managers
   - ID Format: `FBGL [STATE] [DISTRICT] P[COUNT]`
   - Example: `FBGL AP EG P01`
4. **Social Workers** - Reporting to Project Managers
   - ID Format: `FBGL [STATE] [DISTRICT] S[COUNT]`
   - Example: `FBGL AP EG S01`

## Features

### Profile Details
Each profile includes:
- Name
- Profile Picture
- ID Number (in the format specified)
- Area/State/District
- Address
- Phone/Email
- Aadhaar Number
- Bio

### Projects
- Each project can be associated with a Social Worker
- Projects are categorized as Social, Economy, or Education
- Project details include title, description, location, beneficiaries, and status

## Image Storage

Images are stored as Base64 strings in the database by default. For production, consider using Supabase Storage for better performance. See `SUPABASE_SETUP.md` for details.

## License

Copyright © [Current Year] FIRST BORN GOSPEL LIFE MINISTRIES. All rights reserved.

Designed & Developed by Kingdom Creative Media
