const mongoose = require('mongoose');
const MealPlan = require('../models/mealPlanModel');

/**
 * Create a new meal plan template
 * POST /api/meal-plans
 */
exports.createMealPlan = async (req, res) => {
  try {
    const {
      planName,
      dietType,
      calories,
      notes,
      imageUrl,
      meals,
      userId
    } = req.body;

    // Get dietitian ID from authenticated user
    const dietitianId = req.user?.id || req.body.dietitianId;

    // Validate required fields
    if (!planName || !dietType || !calories || !dietitianId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: planName, dietType, calories, dietitianId, userId'
      });
    }

    // Detailed validation
    if (typeof planName !== 'string' || planName.trim().length < 2 || planName.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Plan name must be between 2 and 100 characters'
      });
    }

    const validDietTypes = ['Vegan', 'Vegetarian', 'Keto', 'Mediterranean', 'High-Protein', 'Low-Carb', 'Anything'];
    if (!validDietTypes.includes(dietType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid diet type. Must be one of: ' + validDietTypes.join(', ')
      });
    }

    const caloriesNum = parseInt(calories);
    if (isNaN(caloriesNum) || caloriesNum < 500 || caloriesNum > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Calories must be a number between 500 and 5000'
      });
    }

    if (notes && (typeof notes !== 'string' || notes.length > 500)) {
      return res.status(400).json({
        success: false,
        message: 'Notes must be less than 500 characters'
      });
    }

    if (imageUrl && (typeof imageUrl !== 'string' || !/^https?:\/\/.+/.test(imageUrl))) {
      return res.status(400).json({
        success: false,
        message: 'Image URL must be a valid HTTP/HTTPS URL'
      });
    }

    // Validate meals array
    if (!Array.isArray(meals) || meals.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one meal is required'
      });
    }

    for (let i = 0; i < meals.length; i++) {
      const meal = meals[i];
      if (!meal.name || typeof meal.name !== 'string' || meal.name.trim().length < 2 || meal.name.trim().length > 100) {
        return res.status(400).json({
          success: false,
          message: `Meal ${i + 1}: Name must be between 2 and 100 characters`
        });
      }
      if (meal.calories && (isNaN(parseInt(meal.calories)) || parseInt(meal.calories) < 0 || parseInt(meal.calories) > 2000)) {
        return res.status(400).json({
          success: false,
          message: `Meal ${i + 1}: Calories must be a number between 0 and 2000`
        });
      }
      if (meal.details && (typeof meal.details !== 'string' || meal.details.length > 500)) {
        return res.status(400).json({
          success: false,
          message: `Meal ${i + 1}: Details must be less than 500 characters`
        });
      }
    }

    // Validate dietitianId and userId
    if (!mongoose.Types.ObjectId.isValid(dietitianId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dietitianId or userId'
      });
    }

    // Create new meal plan template
    const mealPlan = new MealPlan({
      planName: planName.trim(),
      dietType,
      calories: caloriesNum,
      notes: notes?.trim() || '',
      imageUrl: imageUrl?.trim() || '',
      meals: meals.map(m => ({
        name: m.name.trim(),
        calories: parseInt(m.calories) || 0,
        details: m.details?.trim() || ''
      })),
      dietitianId,
      userId
    });

    const savedMealPlan = await mealPlan.save();

    res.status(201).json({
      success: true,
      message: 'Meal plan created successfully',
      data: savedMealPlan
    });
  } catch (error) {
    console.error('Error creating meal plan:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create meal plan'
    });
  }
};

/**
 * Get all meal plans for a user
 * GET /api/meal-plans/user/:userId
 */
exports.getUserMealPlans = async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query; // Optional date filter

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    let query = { userId, isActive: true };

    // If date is provided, find meal plans that include that date
    if (date) {
      query.assignedDates = date;
    }

    const mealPlans = await MealPlan.find(query)
      .populate('dietitianId', 'name specialization')
      .exec();

    // Transform to match expected format
    const plansData = mealPlans.map(plan => ({
      ...plan.toObject(),
      id: plan._id
    }));

    res.status(200).json({
      success: true,
      data: plansData,
      count: plansData.length
    });
  } catch (error) {
    console.error('Error fetching user meal plans:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch meal plans'
    });
  }
};

/**
 * Get all meal plan templates for a dietitian
 * GET /api/meal-plans/dietitian/:dietitianId/templates
 */
exports.getDietitianMealPlanTemplates = async (req, res) => {
  try {
    const { dietitianId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(dietitianId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dietitian ID'
      });
    }

    const mealPlans = await MealPlan.find({
      dietitianId,
      isActive: true
    })
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json({
      success: true,
      data: mealPlans,
      count: mealPlans.length
    });
  } catch (error) {
    console.error('Error fetching dietitian meal plan templates:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch meal plan templates'
    });
  }
};

/**
 * Get all meal plan templates for a dietitian's client
 * GET /api/meal-plans/dietitian/:dietitianId/client/:userId
 */
exports.getDietitianClientMealPlans = async (req, res) => {
  try {
    const { dietitianId, userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(dietitianId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dietitian ID or user ID'
      });
    }

    // Get all active meal plans for the dietitian and client
    const mealPlans = await MealPlan.find({
      dietitianId,
      userId,
      isActive: true
    }).sort({ createdAt: -1 });

    // Transform to match expected format
    const plansData = mealPlans.map(plan => ({
      ...plan.toObject(),
      id: plan._id
    }));

    res.status(200).json({
      success: true,
      data: plansData,
      count: plansData.length
    });
  } catch (error) {
    console.error('Error fetching dietitian client meal plans:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch meal plans'
    });
  }
};

/**
 * Get a specific meal plan by ID
 * GET /api/meal-plans/:planId
 */
exports.getMealPlanById = async (req, res) => {
  try {
    const { planId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal plan ID'
      });
    }

    const mealPlan = await MealPlan.findById(planId)
      .populate('dietitianId', 'name specialization')
      .populate('userId', 'name email')
      .exec();

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    res.status(200).json({
      success: true,
      data: mealPlan
    });
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch meal plan'
    });
  }
};

/**
 * Update a meal plan
 * PUT /api/meal-plans/:planId
 */
exports.updateMealPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal plan ID'
      });
    }

    const mealPlan = await MealPlan.findByIdAndUpdate(
      planId,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )
      .populate('dietitianId', 'name specialization')
      .populate('userId', 'name email')
      .exec();

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Meal plan updated successfully',
      data: mealPlan
    });
  } catch (error) {
    console.error('Error updating meal plan:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update meal plan'
    });
  }
};

/**
 * Assign meal plan to dates (update meal plan)
 * POST /api/meal-plans/:planId/assign
 */
exports.assignMealPlanToDates = async (req, res) => {
  try {
    const { planId } = req.params;
    const { dates } = req.body; // Array of date strings in YYYY-MM-DD format

    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal plan ID'
      });
    }

    if (!dates || !Array.isArray(dates)) {
      return res.status(400).json({
        success: false,
        message: 'Dates array is required'
      });
    }

    // Check if meal plan exists and is active
    const mealPlan = await MealPlan.findById(planId);
    if (!mealPlan || !mealPlan.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found or inactive'
      });
    }

    // Add new dates, avoiding duplicates
    const existingDates = new Set(mealPlan.assignedDates);
    const newDates = dates.filter(date => !existingDates.has(date));
    mealPlan.assignedDates = [...mealPlan.assignedDates, ...newDates];
    await mealPlan.save();

    res.status(200).json({
      success: true,
      message: `Meal plan assigned to dates successfully`,
      data: mealPlan
    });
  } catch (error) {
    console.error('Error assigning meal plan to dates:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to assign meal plan'
    });
  }
};

/**
 * Remove meal plan from dates (update meal plan)
 * DELETE /api/meal-plans/:planId/dates
 */
exports.removeMealPlanFromDates = async (req, res) => {
  try {
    const { planId } = req.params;
    const { dates } = req.body; // Array of date strings to remove

    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal plan ID'
      });
    }

    if (!dates || !Array.isArray(dates)) {
      return res.status(400).json({
        success: false,
        message: 'Dates array is required'
      });
    }

    // Find the meal plan
    const mealPlan = await MealPlan.findById(planId);
    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    // Remove specified dates from assignedDates
    mealPlan.assignedDates = mealPlan.assignedDates.filter(date => !dates.includes(date));
    await mealPlan.save();

    res.status(200).json({
      success: true,
      message: `Meal plan removed from ${dates.length} dates`,
      data: mealPlan
    });
  } catch (error) {
    console.error('Error removing meal plan from dates:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to remove meal plan from dates'
    });
  }
};

/**
 * Delete a meal plan template (soft delete)
 * DELETE /api/meal-plans/:planId
 */
exports.deleteMealPlan = async (req, res) => {
  try {
    const { planId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal plan ID'
      });
    }

    const mealPlan = await MealPlan.findByIdAndUpdate(
      planId,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    // Also soft delete all assignments for this meal plan
    // await MealPlanAssignment.updateMany(
    //   { mealPlanId: planId },
    //   { isActive: false, updatedAt: Date.now() }
    // );

    res.status(200).json({
      success: true,
      message: 'Meal plan deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete meal plan'
    });
  }
};