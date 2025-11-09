const express = require('express');
const router = express.Router();
const {
  submitContact,
  getAllQueries,
  submitReply
} = require('../controllers/contactusController');

// POST route for submitting contact queries
router.post('/submit', submitContact);

// GET route for fetching all queries (admin only)
router.get('/queries-list', getAllQueries);

// PUT route for submitting admin replies
router.put('/queries-list/:id/reply', submitReply);

module.exports = router;