# Invoice Management System

## Overview
This is an Invoice/Inventory Management System with a React frontend and Express.js backend. The application was originally built as an Electron desktop app but has been converted to run as a web application on Replit.

## Recent Major Improvements (Latest Update)

### 1. Centralized API Service
- **Created**: `Frontend-Invoice-management/src/services/api.js`
- **Purpose**: Centralized all API calls to reduce code duplication
- **Features**:
  - Single source of truth for API endpoints
  - Consistent error handling across all requests
  - Automatic JSON parsing
  - Support for GET, POST, PUT, DELETE methods
  - Relative URL support for Replit proxy

### 2. Consistent File Naming Convention
All files now follow PascalCase naming convention:
- **Pages**: Dashboard.js, StockPage.js, OverviewDetails.js, ReceiptForm.js
- **Components**: InvoiceGenerator.js, ReceiptModal.js, Summary.js, Breadcrumb.js
- **Improves**: Code readability, consistency, and prevents deployment issues

### 3. Improved Navigation UX
- **Active Menu States**: Side menu now highlights the current page
- **Breadcrumb Navigation**: New breadcrumb component shows current location
- **Better User Experience**: Users can easily see where they are and navigate back

### 4. Code Quality Improvements
- Reduced code duplication with API service
- Consistent error handling
- Better code organization
- Improved maintainability

## Project Structure
- **Frontend-Invoice-management/**: React application (Create React App) with Material-UI and TailwindCSS
- **Invoice-management/**: Express.js backend server with SQLite database
- **local_inventory.db**: SQLite database storing all application data

## Tech Stack
### Frontend
- React 18
- Redux Toolkit for state management
- Material-UI & TailwindCSS for styling
- React Router for navigation
- Axios for API calls
- Centralized API service layer

### Backend
- Node.js with Express
- Sequelize ORM
- SQLite database
- Multer for file uploads
- Nodemailer for email functionality

## Features
- User authentication (Login/Register)
- Customer management
- Product/inventory management
- Receipt generation
- Transaction tracking
- Account management
- Email sending capabilities
- PDF/Invoice generation
- Active navigation states
- Breadcrumb navigation

## Development Setup
The project runs with two workflows:
1. **Backend**: Express server on port 3001
2. **Frontend**: React dev server on port 5000

Both workflows start automatically when the project is opened.

## Database
The application uses SQLite with the following tables:
- workers
- customers
- products
- accounts
- transactions
- receipts

The database is automatically created and synchronized on first run.

## Deployment
The project is configured for Replit deployment:
- Build command: Compiles the React app
- Run command: Serves the built React app from the Express server on port 5000
- Database: SQLite file stored in the project root

## Environment Configuration
- Frontend runs on `0.0.0.0:5000` (development)
- Backend runs on `localhost:3001` (development)
- Frontend uses proxy to communicate with backend
- In production, the backend serves the built frontend on port 5000

## Code Organization Best Practices
1. **API calls**: Use the centralized API service (`src/services/api.js`)
2. **File naming**: All files follow PascalCase convention
3. **Component structure**: Reusable components in `src/components/`
4. **Page structure**: Route-based pages in `src/pages/`
5. **State management**: Redux slices in `src/store/slice/`

## Navigation System
- **SideMenu**: Main navigation with active state indicators
- **Breadcrumb**: Shows current page location
- **Header**: Top navigation bar
- **Layout**: Wraps all pages with consistent navigation

## Recent Changes (GitHub Import + UX Improvements)
- Updated database connection from Windows path to relative path
- Configured React dev server for Replit proxy environment
- Updated all API calls to use relative URLs with proxy
- Fixed backend to return empty arrays instead of 404 for empty resources
- Added production static file serving to Express server
- Configured deployment for Replit autoscale
- **NEW**: Created centralized API service
- **NEW**: Renamed all files to PascalCase convention
- **NEW**: Added active menu states and breadcrumb navigation
- **NEW**: Improved code organization and reduced duplication

## Notes
- The original project was an Electron desktop app
- Converted to web app for Replit environment
- All hardcoded URLs replaced with relative URLs or environment variables
- The app uses the proxy feature in development for API calls
- API service handles all backend communication
- Navigation system provides clear user orientation
