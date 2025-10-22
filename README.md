# FDFED Project - Maanas Module

## Project Overview

Maanas is a comprehensive health management module built with React and Node.js that facilitates communication between clients, dietitians, and administrators for lab report management, document verification, and health consultations.

## Features

### 1. Contact Management
- **Contact Form**: Interactive form for users to submit inquiries
- **Email Validation**: Client-side and server-side validation
- **Message Storage**: Persistent storage of contact submissions
- **Admin Review**: Backend processing and response handling

### 2. Lab Report Management
- **File Upload**: Secure upload of lab reports with drag-and-drop support
- **Document Storage**: Organized storage with metadata tracking
- **Progress Tracking**: Real-time upload progress indicators
- **File Retrieval**: Efficient download and access control

### 3. Report Viewing
- **Client Viewer**: Personal lab report access with PDF display
- **Dietitian Viewer**: Professional-grade report review with annotation tools
- **Document Display**: Secure PDF rendering with viewer controls

### 4. Document Status Tracking
- **Verification Workflow**: Multi-stage approval process
- **Dietitian Status**: Document submission and review timeline
- **Organization Dashboard**: Centralized status overview and analytics
- **Real-time Updates**: Live status synchronization

### 5. Admin Tools
- **Query Interface**: System data querying and reporting
- **User Metrics**: Analytics and performance monitoring
- **System Management**: Administrative control panel

### 6. User Guide
- **Help Documentation**: Step-by-step instructions
- **Feature Overview**: Comprehensive feature guide
- **Best Practices**: Usage recommendations

## Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MongoDB (assumed from schema structure)
- **File Upload**: Multipart form data handling
- **PDF Viewer**: Document rendering integration

## Project Structure

```
maanas/
├── Models/
│   ├── contactusModel.js       # Contact form schema
│   └── labReportModel.js       # Lab report schema
├── Controllers/
│   ├── contactusController.js  # Contact submission logic
│   ├── labReportController.js  # Report upload/retrieval
│   └── statusController.js     # Approval workflow
├── Routes/
│   ├── contactusRoutes.js      # Contact endpoints
│   └── labReportRoutes.js      # Report endpoints
├── Services/
│   └── contactService.js       # Frontend API service
├── Components/
│   ├── Contactus.jsx           # Contact form UI
│   ├── LabReportUploader.jsx   # Upload interface
│   ├── ClientLabReportViewer.jsx
│   ├── DietitianLabReportViewer.jsx
│   ├── DietitianDocStatus.jsx
│   ├── OrgDocStatus.jsx
│   ├── AdminQueries.jsx        # Admin dashboard
│   └── Guide.jsx               # User guide
└── README.md                   # Project documentation
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```
DATABASE_URL=your_mongodb_connection
PORT=5000
FILE_UPLOAD_PATH=./uploads
```

3. Start the development server:
```bash
npm start
```

## API Endpoints

### Contact Us
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Retrieve contact messages (Admin)

### Lab Reports
- `POST /api/reports/upload` - Upload lab report
- `GET /api/reports/:id` - Retrieve report
- `GET /api/reports` - List user reports

### Document Status
- `GET /api/status/:userId` - Get document status
- `PUT /api/status/:reportId` - Update approval status

## User Roles

1. **Clients**: Submit lab reports, view personal reports, contact support
2. **Dietitians**: Review reports, annotate findings, approve documents
3. **Organization Admin**: Monitor all submissions, view analytics, manage users

## Development Timeline

- **Oct 22-27**: Database models and backend logic setup
- **Oct 28-29**: API route configuration
- **Oct 30**: Frontend service layer
- **Nov 1-8**: User interface components
- **Nov 10-18**: Admin tools and dashboards
- **Nov 26**: Documentation finalization

## Contributing

Please follow the established folder structure and commit message conventions when adding new features.

## License

This project is proprietary and confidential.


## Support

 questions or issues, please contact the development team or use the Contact Us feature within the application.