const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// GET all progress entries
router.get('/user-progress', progressController.getProgressController);

// GET progress by plan filter
router.get('/user-progress/filter', progressController.getProgressByPlanController);

// GET stats for a specific plan
router.get('/user-progress/stats', progressController.getPlanStatsController);

// POST create new progress entry
router.post('/user-progress', progressController.createProgressController);

// DELETE progress entry
router.delete('/user-progress/:id', progressController.deleteProgressController);

module.exports = router;
