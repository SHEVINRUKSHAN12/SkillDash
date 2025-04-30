const mongoose = require('mongoose');
const ReviewsRating = require('../models/reviewsRatingModel');

// Manual ObjectId validator to bypass Mongoose's strict validation
function isValidObjectId(id) {
  if (!id || typeof id !== 'string') return false;
  
  // Clean the ID - remove any whitespace or quotes that could be causing issues
  const cleanId = id.trim().replace(/['"]/g, '');
  
  // ObjectIds must be 24 hex characters
  return /^[0-9a-fA-F]{24}$/.test(cleanId);
}

// Convert string to ObjectId safely
function toObjectId(id) {
  if (!id) return null;
  const cleanId = id.trim().replace(/['"]/g, '');
  return new mongoose.Types.ObjectId(cleanId);
}

exports.createReview = async (req, res) => {
  try {
    console.log('createReview called with body:', JSON.stringify(req.body));
    const { serviceId, providerId, customerId, rating, feedback } = req.body;
    
    // Check for required fields
    if (!serviceId || !providerId || !customerId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: serviceId, providerId, customerId, and rating are required'
      });
    }

    // Validate all IDs in one step for clearer error message
    const idValidation = {
      serviceId: isValidObjectId(serviceId),
      providerId: isValidObjectId(providerId),
      customerId: isValidObjectId(customerId)
    };
    
    const invalidIds = Object.keys(idValidation).filter(key => !idValidation[key]);
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format for: ${invalidIds.join(', ')}`,
        details: {
          serviceId: { value: serviceId, valid: idValidation.serviceId },
          providerId: { value: providerId, valid: idValidation.providerId },
          customerId: { value: customerId, valid: idValidation.customerId }
        }
      });
    }

    // All IDs are valid strings, now create with bypassing direct ObjectId conversion
    try {
      console.log("Creating review directly with schema...");
      
      // Create the document with ObjectIds
      const reviewData = {
        serviceId: toObjectId(serviceId),
        providerId: toObjectId(providerId),
        customerId: toObjectId(customerId),
        rating: Number(rating),
        feedback: feedback || ''
      };
      
      console.log("Clean review data:", reviewData);
      
      // Save to database
      const newReview = await ReviewsRating.create(reviewData);
      
      console.log('★★★ REVIEW SAVED SUCCESSFULLY ★★★');
      console.log(newReview);
      return res.status(201).json({ 
        success: true, 
        review: newReview,
        message: 'Review submitted successfully!'
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).json({
        success: false,
        message: 'Database error while saving review',
        error: dbError.message
      });
    }
  } catch (error) {
    console.error('Exception in createReview:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating review'
    });
  }
};

exports.getReviewsByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    console.log("Getting reviews for serviceId:", serviceId);
    
    if (!isValidObjectId(serviceId)) {
      console.log("Invalid serviceId format:", serviceId);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid serviceId format'
      });
    }
    
    // Use find directly with a string ID - this can help if ObjectId conversion is causing issues
    const reviews = await ReviewsRating.find({ 
      serviceId: serviceId
    }).sort({ createdAt: -1 });
    
    console.log("Found reviews:", reviews.length);
    
    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

exports.getReviewsByProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    console.log("Getting reviews for providerId:", providerId);
    
    if (!isValidObjectId(providerId)) {
      console.log("Invalid providerId format:", providerId);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid providerId format'
      });
    }
    
    // Find all reviews for this provider
    const reviews = await ReviewsRating.find({ 
      providerId: providerId
    })
    // Join with the services collection to get service titles
    .populate('serviceId', 'title')
    .sort({ createdAt: -1 });
    
    // Format the reviews for better display
    const formattedReviews = reviews.map(review => ({
      ...review.toObject(),
      serviceTitle: review.serviceId?.title || 'Service'
    }));
    
    console.log(`Found ${formattedReviews.length} reviews for provider ${providerId}`);
    
    return res.status(200).json({ 
      success: true, 
      reviews: formattedReviews 
    });
  } catch (error) {
    console.error("Error fetching provider reviews:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Add a debug endpoint to help diagnose review issues
exports.debugReviews = async (req, res) => {
  try {
    const { providerId } = req.body;
    
    console.log("DEBUG: Checking reviews for providerId:", providerId);
    
    // Count all reviews in the collection
    const totalReviews = await ReviewsRating.countDocuments();
    
    // Try different formats of the provider ID to see if any match
    const originalIdReviews = await ReviewsRating.find({ providerId }).lean();
    
    // Try with ObjectId conversion
    let objectIdReviews = [];
    try {
      if (isValidObjectId(providerId)) {
        const providerObjectId = toObjectId(providerId);
        objectIdReviews = await ReviewsRating.find({ 
          providerId: providerObjectId 
        }).lean();
      }
    } catch (err) {
      console.error("Error in ObjectId search:", err);
    }
    
    // Try a string comparison (less efficient but might find mismatched ID types)
    const allReviews = await ReviewsRating.find({}).lean();
    const stringMatchReviews = allReviews.filter(review => {
      const reviewProviderId = review.providerId?.toString();
      return reviewProviderId === providerId;
    });
    
    // Get a sample of available provider IDs in the reviews collection
    const sampleReviews = await ReviewsRating.find({})
      .limit(5)
      .select('providerId')
      .lean();
      
    const sampleProviderIds = sampleReviews.map(r => ({
      providerId: r.providerId?.toString(),
      type: typeof r.providerId,
      isObjectId: r.providerId instanceof mongoose.Types.ObjectId
    }));
    
    return res.status(200).json({
      success: true,
      debug: {
        requestedProviderId: providerId,
        totalReviewsInCollection: totalReviews,
        exactMatchCount: originalIdReviews.length,
        objectIdMatchCount: objectIdReviews.length,
        stringMatchCount: stringMatchReviews.length,
        reviewSamples: sampleProviderIds
      }
    });
  } catch (error) {
    console.error("Error in debug reviews:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// This function helps create a test review for debugging
exports.createTestReview = async (req, res) => {
  try {
    const { providerId } = req.body;
    
    if (!providerId || !isValidObjectId(providerId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid providerId is required'
      });
    }
    
    // Create a test review for the provider
    const testReview = new ReviewsRating({
      serviceId: new mongoose.Types.ObjectId(), // Generate a dummy service ID
      providerId: toObjectId(providerId),
      customerId: new mongoose.Types.ObjectId(), // Generate a dummy customer ID
      rating: 5,
      feedback: "This is a test review created for debugging"
    });
    
    await testReview.save();
    
    return res.status(200).json({
      success: true,
      message: 'Test review created successfully',
      review: testReview
    });
  } catch (error) {
    console.error("Error creating test review:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
