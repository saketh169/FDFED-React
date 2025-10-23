NutriConnect Project Structure (React with Client-Side Routing)
Backend (Node.js/Express API)
Streamlined to serve as a RESTful API, with consolidated controllers and routes, retaining essential models and utilities, and adding minimal files for new features.
backend/
├── server.js                              # Main Express server (configures middleware, routes)
├── package.json                          # Dependencies (express, mongoose, nodemailer, jsonwebtoken, bcrypt, multer, pdfkit)
├── package-lock.json                     # Locked dependency versions
│
├── config/                               # Configuration
│   └── db.js                            # MongoDB connection (from original utils/db.js)
│
├── controllers/                          # Consolidated API controllers
│   ├── auth-controller.js                # Auth (signin, signup, change password, edit profile, admin routes with guards)
│   ├── blog-controller.js                # Blog CRUD
│   ├── booking-controller.js             # Booking and slot management (includes block slots)
│   ├── contact-controller.js             # Contact form and queries (includes email notifications)
│   ├── dietitian-controller.js           # Dietitian management (merged server-diet.js)
│   ├── diet-plan-controller.js           # Diet plan CRUD
│   ├── lab-controller.js                 # Lab reports (includes dietitian report sending)
│   ├── payment-controller.js             # Payment processing (extends for corporate plans)
│   ├── organization-controller.js        # Organization management (merged server-org.js)
│   ├── corporate-controller.js           # New: Corporate portal (employee wellness, bulk subscriptions)
│   └── export-controller.js              # New: PDF export for progress data
│
├── models/                               # MongoDB schemas (updated for new features)
│   ├── blogModel.js                     # Blog schema
│   ├── bookingModel.js                  # Booking schema (adds status: booked/blocked/available)
│   ├── chatModel.js                     # Chat schema
│   ├── contactusModel.js                # Contact schema
│   ├── dietPlanModel.js                 # Diet plan schema
│   ├── labReportModel.js                # Lab report schema (adds dietitian-sent report fields)
│   ├── paymentModel.js                  # Payment schema
│   ├── progressModel.js                 # Progress schema
│   ├── userModel.js                     # User schema (adds notification preferences)
│   ├── organizationModel.js             # Organization schema
│   ├── dietitianModel.js                # Dietitian schema
│   ├── subscriptionModel.js             # Subscription schema
│   └── corporateModel.js                # New: Corporate schema (company details, employee list)
│
├── routes/                               # API routes (aligned with controllers)
│   ├── auth-routes.js                   # Auth routes (protected admin routes)
│   ├── blog-routes.js                   # Blog routes
│   ├── booking-routes.js                # Booking routes (includes /dietitian/schedule/block)
│   ├── contact-routes.js                # Contact and query routes
│   ├── dietitian-routes.js              # Dietitian routes
│   ├── diet-plan-routes.js              # Diet plan routes
│   ├── lab-routes.js                    # Lab routes (includes /dietitian/report/send)
│   ├── payment-routes.js                # Payment routes
│   ├── organization-routes.js           # Organization routes
│   ├── corporate-routes.js              # New: Corporate routes
│   ├── notification-routes.js           # New: Notification routes (email triggers)
│   └── export-routes.js                 # New: PDF export routes
│
├── middleware/                           # Custom middleware
│   ├── authMiddleware.js                # JWT auth and role checks (e.g., admin guard with secret key)
│   └── uploadMiddleware.js              # File upload handling (multer)
│
├── utils/                                # Utilities
│   ├── emailUtils.js                    # Nodemailer setup (extended for notifications)
│   └── pdfUtils.js                      # New: PDF generation (server-side with pdfkit)
│
├── scripts/                              # Database seeding (unchanged)
│   ├── seedBlog.js
│   ├── seedBookedslots.js
│   ├── seedChatbot.js
│   ├── seedDietitians.js
│   └── seedDietPlans.js
│
└── uploads/                              # File uploads directory (unchanged)

Frontend (React with Client-Side Routing)
Replaces EJS views with a React SPA, using react-router-dom for client-side routing, custom hooks for logic, and reused CSS/images from the original project. Includes new features with minimal backend dependency.
frontend/
├── package.json                          # Dependencies (react, react-dom, react-router-dom, axios, bootstrap, jspdf)
├── package-lock.json                     # Locked dependency versions
├── vite.config.js                        # Vite config for build (or create-react-app)
│
├── public/                               # Static assets (reused from original)
│   ├── index.html                       # Main HTML (mounts React app)
│   ├── favicon.ico                      # Favicon
│   ├── css/                             # Global CSS (from original, e.g., index.css, dietitian.css)
│   │   ├── chatbot.css
│   │   ├── dietitian.css
│   │   ├── dietitian-info.css
│   │   ├── dietitian_profiles.css
│   │   ├── index.css
│   │   ├── Lab_user.css
│   │   ├── Sign_in.css
│   │   ├── Sign_up.css
│   │   └── user.css
│   ├── images/                          # Images (from original IMAGES/)
│   │   ├── ad1.jpeg
│   │   ├── ad2.webp
│   │   ├── ad3.jpg
│   │   ├── ad4.webp
│   │   ├── ad5.png
│   │   ├── ad6.jpg
│   │   ├── Admin.jpeg
│   │   ├── dietitian_feature1.png
│   │   ├── dietitian_feature2.png
│   │   ├── dietitian_step2.png
│   │   ├── dietitian_step3.png
│   │   ├── dietitian_step4.png
│   │   ├── dietitian_step5.png
│   │   ├── dietitian_step6.png
│   │   ├── dietitian_step7.png
│   │   ├── dietitian_step8.png
│   │   ├── dietitian_step9.png
│   │   ├── dietitian_welcome.jpg
│   │   ├── Dietitian.jpg
│   │   ├── GET-STARTED.avif
│   │   ├── index.jpg
│   │   ├── LOGIN.avif
│   │   ├── Logo.png
│   │   ├── Organization.jpg
│   │   ├── step1.png
│   │   ├── T1.jpg
│   │   ├── T2.png
│   │   ├── T3.avif
│   │   ├── user_feature1.png
│   │   ├── user_feature2.png
│   │   ├── user_feature3.png
│   │   ├── user_feature4.png
│   │   ├── user_feature5.png
│   │   ├── user_step2.png
│   │   ├── user_step3.png
│   │   ├── user_step4.png
│   │   ├── user_step5.png
│   │   ├── user_step6.png
│   │   ├── user_step7.png
│   │   ├── user_step8.png
│   │   ├── user_step9.png
│   │   ├── user_step10.png
│   │   ├── user_welcome.jpg
│   │   └── User.png
│   └── blog-images/                     # Blog images (empty)
│
├── src/                                  # React source code
│   ├── main.jsx                         # Entry point (renders App with Router)
│   ├── App.jsx                          # Root component (sets up Router, global layout)
│   │
│   ├── components/                      # Reusable UI components
│   │   ├── common/                      # Shared components
│   │   │   ├── Navbar.jsx               # Navigation bar
│   │   │   ├── Footer.jsx               # Footer
│   │   │   ├── LoadingSpinner.jsx       # Loading indicator
│   │   │   ├── NotificationToggle.jsx   # New: Toggle for notification preferences
│   │   │   └── ExportButton.jsx         # New: Button for PDF export
│   │   ├── auth/                        # Authentication components
│   │   │   ├── SignIn.jsx               # Sign-in form
│   │   │   ├── SignUp.jsx               # Sign-up form (hides admin role)
│   │   │   ├── RoleSelector.jsx         # Role selector (conditional admin)
│   │   │   ├── ChangePassword.jsx       # Password change
│   │   │   └── EditProfile.jsx          # Profile editing
│   │   ├── dashboards/                  # Dashboard components
│   │   │   ├── UserDashboard.jsx        # User dashboard
│   │   │   ├── DietitianDashboard.jsx   # Dietitian dashboard
│   │   │   ├── OrganizationDashboard.jsx # Organization dashboard
│   │   │   ├── AdminDashboard.jsx       # Admin dashboard
│   │   │   └── CorporateDashboard.jsx   # New: Corporate dashboard (employee metrics)
│   │   ├── consultations/               # Consultation components
│   │   │   ├── UserConsultations.jsx    # User consultations
│   │   │   ├── DietitianConsultations.jsx # Dietitian consultations
│   │   │   ├── ChatInterface.jsx        # Chat interface
│   │   │   └── Chatbot.jsx              # Chatbot
│   │   ├── schedules/                   # Schedule components
│   │   │   ├── UserSchedule.jsx         # User schedule
│   │   │   └── DietitianSchedule.jsx    # Dietitian schedule (with block slot sidebar)
│   │   ├── meals/                       # Meal components
│   │   │   ├── UserMeals.jsx            # User meals
│   │   │   └── DietitianMeals.jsx       # Dietitian meals
│   │   ├── labs/                        # Lab report components
│   │   │   ├── UserLab.jsx              # User lab
│   │   │   ├── DietitianLab.jsx         # Dietitian lab (with report sending)
│   │   │   └── UserLabReports.jsx       # User reports
│   │   ├── blogs/                       # Blog components
│   │   │   ├── BlogList.jsx             # Blog listing
│   │   │   ├── SingleBlog.jsx           # Single blog
│   │   │   └── BlogPost.jsx             # Blog creation
│   │   ├── health-pages/                # Health topic pages
│   │   │   ├── CardiacHealth.jsx        # Cardiac health
│   │   │   ├── DiabetesThyroid.jsx      # Diabetes/thyroid
│   │   │   ├── GutHealth.jsx            # Gut health
│   │   │   ├── SkinHair.jsx             # Skin/hair
│   │   │   ├── WeightManagement.jsx     # Weight management
│   │   │   └── WomensHealth.jsx         # Women's health
│   │   ├── profiles/                    # Profile components
│   │   │   ├── DietitianProfiles.jsx    # Dietitian profiles
│   │   │   ├── DietitianInfo.jsx        # Dietitian info
│   │   │   └── UserProgress.jsx         # User progress (with PDF export)
│   │   ├── payments/                    # Payment components
│   │   │   ├── Pricing.jsx              # Pricing page
│   │   │   └── Payment.jsx              # Payment interface
│   │   ├── verification/                # Verification components
│   │   │   ├── VerifyDietitian.jsx      # Dietitian verification
│   │   │   └── VerifyOrganization.jsx   # Organization verification
│   │   ├── queries/                     # Query components
│   │   │   ├── ContactUs.jsx            # Contact form
│   │   │   └── Queries.jsx              # Queries
│   │   └── misc/                        # Miscellaneous
│   │       ├── PrivacyPolicy.jsx        # Privacy policy
│   │       ├── TermsConditions.jsx      # Terms and conditions
│   │       └── Analytics.jsx            # Analytics dashboard
│   │
│   ├── pages/                           # Page-level components
│   │   ├── HomePage.jsx                 # Homepage
│   │   ├── UserPage.jsx                 # User main page
│   │   ├── DietitianPage.jsx            # Dietitian main page
│   │   ├── OrganizationPage.jsx         # Organization main page
│   │   ├── AdminPage.jsx                # Admin panel
│   │   ├── CorporatePage.jsx            # New: Corporate portal page
│   │   └── NotFound.jsx                 # 404 page
│   │
│   ├── routes/                          # React Router setup
│   │   ├── AppRoutes.jsx                # Defines all routes (client-side)
│   │   └── ProtectedRoute.jsx           # Wrapper for auth-protected routes
│   │
│   ├── hooks/                           # Custom hooks (as requested)
│   │   ├── useAuth.js                   # Auth (login/logout, user state)
│   │   ├── useFetchData.js              # Data fetching (Axios)
│   │   ├── useNotifications.js           # New: Notification handling
│   │   ├── useBooking.js                # Booking and slot management
│   │   ├── useExportPdf.js              # New: Client-side PDF export (jsPDF)
│   │   └── useUpload.js                 # File uploads
│   │
│   ├── services/                        # API services
│   │   ├── api.js                       # Axios instance (with auth headers)
│   │   ├── authService.js               # Auth API calls
│   │   ├── bookingService.js            # Booking API calls
│   │   ├── dietitianService.js          # Dietitian API calls
│   │   ├── paymentService.js            # Payment API calls
│   │   ├── corporateService.js          # New: Corporate API calls
│   │   └── notificationService.js       # New: Notification API calls
│   │
│   ├── utils/                           # Frontend utilities
│   │   ├── constants.js                 # API base URL, roles, etc.
│   │   └── helpers.js                   # Date formatting, etc.
│   │
│   └── styles/                          # CSS modules (optional, for component-specific styles)
│       └── App.css                      # Global app styles
│
└── tests/                               # Tests (optional)
    ├── components/                      # Component tests
    └── hooks/                           # Hook tests

Notes

Backend Minimization:
Removed app-route.js, crud-routes.js, dietitianInfoController.js, server-diet.js, server-org.js by merging into auth-controller.js, dietitian-controller.js, and organization-controller.js.
Consolidated routes into corresponding controller-specific files.
Kept scripts/ and uploads/ unchanged as they’re essential.
Added minimal new files: corporate-controller.js, export-controller.js, notification-routes.js, corporateModel.js, pdfUtils.js.


Frontend:
Replaced EJS views with React components, organized by feature (e.g., dashboards/, consultations/).
Client-side routing handled by AppRoutes.jsx and ProtectedRoute.jsx using react-router-dom.
Custom hooks (useAuth.js, useFetchData.js, etc.) manage state and API calls.
Reused original CSS and images to maintain design consistency.
New features integrated: corporate dashboard, notification toggle, slot blocking sidebar, PDF export button, and dietitian report sending form.


New Features:
Corporate Portal: New corporateModel.js, corporate-routes.js, corporate-controller.js, and CorporateDashboard.jsx.
Hiding Admin Role: Implemented in SignUp.jsx and RoleSelector.jsx with conditional rendering; backend auth-routes.js uses authMiddleware.js for admin route protection.
Blocking Slots: Added status field in bookingModel.js, route in booking-routes.js, and sidebar in DietitianSchedule.jsx.
Notification System: Extended emailUtils.js and added notification-routes.js and notificationService.js; toggle in NotificationToggle.jsx.
Progress Export to PDF: Client-side with useExportPdf.js and jsPDF; fallback server-side route in export-routes.js using pdfUtils.js.
Doctor-Side Report Sending: Extended labReportModel.js, added route in lab-routes.js, and form in DietitianLab.jsx.