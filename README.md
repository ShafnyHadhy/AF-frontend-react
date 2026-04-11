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
