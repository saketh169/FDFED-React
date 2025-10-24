const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


/**
 * Middleware utility to explicitly set req.params.role based on the route path.
 */
const injectRole = (role) => (req, res, next) => {
    req.params.role = role;
    next();
};

// --- SIGNUP ROUTES ---
// 1. User Signup Route: POST /api/signup/user
router.post('/signup/user', 
    injectRole('user'), 
    authController.signupController
);

// 2. Admin Signup Route: POST /api/signup/admin
router.post('/signup/admin', 
    injectRole('admin'), 
    authController.signupController
);

// 3. Dietitian Signup Route: POST /api/signup/dietitian
router.post('/signup/dietitian', 
    injectRole('dietitian'), 
    authController.signupController
);

// 4. Organization Signup Route: POST /api/signup/organization
router.post('/signup/organization', 
    injectRole('organization'), 
    authController.signupController
);

// 5. Corporate Partner Signup Route: POST /api/signup/corporatepartner
router.post('/signup/corporatepartner', 
    injectRole('corporatepartner'), 
    authController.signupController
);

// --- SIGNIN ROUTES ---
// 6. User Signin Route: POST /api/signin/user
router.post('/signin/user', 
    injectRole('user'), 
    authController.signinController
);

// 7. Admin Signin Route: POST /api/signin/admin
router.post('/signin/admin', 
    injectRole('admin'), 
    authController.signinController
);

// 8. Dietitian Signin Route: POST /api/signin/dietitian
router.post('/signin/dietitian', 
    injectRole('dietitian'), 
    authController.signinController
);

// 9. Organization Signin Route: POST /api/signin/organization
router.post('/signin/organization', 
    injectRole('organization'), 
    authController.signinController
);

// 10. Corporate Partner Signin Route: POST /api/signin/corporatepartner
router.post('/signin/corporatepartner', 
    injectRole('corporatepartner'), 
    authController.signinController
);


module.exports = router;
