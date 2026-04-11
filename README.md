<<<<<<< HEAD
# Electronic Product Lifecycle Tracker - Frontend

This is the frontend dashboard for the Electronic Product Lifecycle Tracker, built with React, Vite, and Tailwind CSS.

## Features

- **Dynamic Dashboards**: Custom views for Customers, Providers, and Admins.
- **Maps Integration**: Location-aware service provider discovery using Leaflet and Google Maps API.
- **Real-time Filtering**: Advanced search and categorization for product inventory.
- **Analytics Visualization**: Interactive charts using Recharts for admin insights.
- **Product Lifecycle Forms**: Streamlined forms for adding, editing, and requesting repairs/recycling.
- **Responsive Design**: Mobile-first UI using Tailwind CSS.

---

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- Backend server running (default: http://localhost:5001)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd backend/AF-frontend-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root of `AF-frontend-react`:
   ```env
   VITE_API_BASE_URL=http://localhost:5001/api
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Access the application:
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Build for Production

To create a production build:
```bash
npm run build
```
The optimized files will be available in the `dist/` directory.

---

## Technical Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Data Fetching**: Axios
- **State Management**: React Context / Hooks
- **Charts**: Recharts
- **Maps**: Leaflet & React-Leaflet
- **Icons**: Lucide-React & React-Icons

---

## Documentation

- **[Testing Instruction Report](../../TESTING_REPORT.md)**
- **[Deployment Report](../../DEPLOYMENT_REPORT.md)**
=======
# ReVolve – Frontend Application

ReVolve is the frontend of the **Service Provider Management System**, built with React and Vite. It provides the user interface for customers, providers, recyclers, and administrators to manage repair and recycling workflows.

---

## Project Overview

### Main Features
- User registration, login, and OTP verification
- Customer dashboard and product lifecycle flow
- Repair and recycling request forms
- Provider dashboard, inbox, and request management
- Provider profile management
- Admin reporting and statistics views
- Google Maps location selection and nearby provider discovery

### Tech Stack
- **React 19**
- **Vite**
- **React Router DOM**
- **Axios**
- **Tailwind CSS**
- **React Hot Toast**
- **Google Maps API**

---

## Setup Instructions

### 1. Prerequisites
- Node.js 18 or later
- npm 8 or later
- A running backend API

### 2. Clone the Project
```bash
git clone https://github.com/ShafnyHadhy/AF-backend-express.git
cd AF-frontend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the frontend root directory:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 5. Start the Development Server
```bash
npm run dev
```

The app will run on the Vite local development server.

### 6. Build for Production
```bash
npm run build
```

### 7. Preview the Production Build
```bash
npm run preview
```

### 8. Lint the Project
```bash
npm run lint
```

---

## Deployment Report

### Frontend Deployment – Vercel

#### Deployment Steps
1. Push the frontend code to GitHub.
2. Import the repository into Vercel.
3. Set the following environment variables in Vercel:
	- `VITE_API_URL` → your Railway backend URL
	- `VITE_GOOGLE_MAPS_API_KEY` → your Google Maps API key
4. Set the build command to:
	```bash
	npm run build
	```
5. Set the output directory to:
	```bash
	dist
	```
6. Deploy the project.

#### Vercel Notes
- Vercel automatically handles static React builds from Vite.
- If the app uses client-side routing, configure Vercel to redirect all routes to `index.html`.

### Backend Deployment – Railway

#### Deployment Steps
1. Push the backend code to GitHub.
2. Import the backend repository into Railway.
3. Add the backend environment variables:
	- `PORT`
	- `MONGO_URI`
	- `JWT_SECRET_KEY`
	- `SENDGRID_API_KEY`
	- `EMAIL_FROM`
4. Set the start command to your backend start script.
5. Deploy the backend service.

#### Backend Notes
- Use the Railway public URL as the value for `VITE_API_URL` in the frontend.
- Make sure CORS is enabled in the backend for the Vercel domain.

---

## Testing Instruction Report

### Frontend Testing
This frontend project currently focuses on build and lint validation.

#### Recommended Commands
```bash
npm run lint
npm run build
```

#### What These Tests Verify
- Code style and lint issues
- React hook usage and component quality
- Production build correctness

### Backend Testing
Backend tests are maintained in the `AF-backend` folder.

#### Unit and Integration Tests
```bash
cd ../AF-backend
npm test
```

#### Run a Specific Test File
```bash
npm test -- tests/unit/providerController.test.js
```

#### Performance Testing
```bash
npx artillery run artillery.yml
```

#### What to Check
- Unit tests for controller and validation logic
- Integration tests for API endpoints
- Load testing response times and error rates

---

## Project Structure

```text
src/
  components/
  pages/
  assets/
  App.jsx
  main.jsx
```

---

## Environment Variables Summary

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps integration |

---

## Notes

- The frontend communicates with the backend through REST API endpoints.
- All authenticated requests should include a valid JWT token.
- Update `VITE_API_URL` when switching between local development and deployed environments.
>>>>>>> bda79a50fd9fc228bdd2cf84f76a45ff985353b2
