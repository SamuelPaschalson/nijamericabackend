const Business = require("./model");
const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
const upload = require("./upload");

// Regular expressions for email and phone number validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;

exports.list_business = async (req, res) => {
  console.log(req.file);
  upload.single("business_image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: "Image upload failed",
        error: err.message,
      });
    }

    const {
      business_name,
      location,
      business_owner,
      business_description,
      business_phone,
      business_category,
      product,
      review,
      business_id,
    } = req.body;

    const imagePath = req.file ? req.file.path : null; // Single image path

    const userdata = {
      business_name,
      location,
      business_owner,
      business_description,
      business_phone,
      business_category,
      business_id,
      product,
      review,
      business_image: imagePath, // Save single image path
    };

    try {
      const businessExist = await Business.findOne({ business_name });

      if (businessExist) {
        return res.status(409).json({
          success: false,
          message: "Business Name already exists",
        });
      }

      const newBusiness = new Business(userdata);
      const savedBusiness = await newBusiness.save();

      if (savedBusiness) {
        return res.status(201).json({
          success: true,
          data: savedBusiness,
          request: {
            type: "POST",
            url: "http://localhost:3000/api/nija/business/add-business",
          },
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
};

exports.fetch_business = async (req, res) => {
  const { business_id } = req.params; // Business ID from URL params
  const { page = 1, limit = 10 } = req.query; // Default page is 1, limit is 10 if not provided

  try {
    if (!business_id) {
      return res.status(400).json({
        success: false,
        message: "Business ID is required",
      });
    }

    // Convert page and limit to numbers to avoid issues with string values from req.query
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Find all businesses with the provided business_id and apply pagination
    const businesses = await Business.find({ business_id })
      .skip((pageNum - 1) * limitNum) // Skip the previous pages' items
      .limit(limitNum); // Limit the number of results returned

    // Get the total count of businesses matching the business_id for pagination metadata
    const totalBusinesses = await Business.countDocuments({ business_id });

    if (businesses.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No businesses found with the business ID: ${business_id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Businesses retrieved successfully",
      data: businesses,
      pagination: {
        currentPage: pageNum,
        itemsPerPage: limitNum,
        totalItems: totalBusinesses,
        totalPages: Math.ceil(totalBusinesses / limitNum),
      },
      request: {
        type: "GET",
        url: `http://localhost:3000/api/nija/business/fetch-business/${business_id}?page=${pageNum}&limit=${limitNum}`,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.fetch_all_businesses = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default page is 1, limit is 10 if not provided

  try {
    // Convert page and limit to numbers to avoid issues with string values from req.query
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Find all businesses and apply pagination
    const businesses = await Business.find()
      .skip((pageNum - 1) * limitNum) // Skip the previous pages' items
      .limit(limitNum); // Limit the number of results returned

    // Get the total count of businesses for pagination metadata
    const totalBusinesses = await Business.countDocuments();

    if (businesses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No businesses found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Businesses retrieved successfully",
      data: businesses,
      pagination: {
        currentPage: pageNum,
        itemsPerPage: limitNum,
        totalItems: totalBusinesses,
        totalPages: Math.ceil(totalBusinesses / limitNum),
      },
      request: {
        type: "GET",
        url: `http://localhost:3000/api/nija/business/fetch-all-businesses?page=${pageNum}&limit=${limitNum}`,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.count_businesses_by_user = async (req, res) => {
    const { userId } = req.params; // Extract user ID from request params

    try {
        // Count the number of businesses associated with the user ID
        const businessCount = await Business.countDocuments({ business_id: userId });

        if (businessCount === 0) {
            return res.status(404).json({
                success: false,
                message: "No businesses found for this user",
            });
        }

        return res.status(200).json({
            success: true,
            message: `Total businesses for user ${userId}: ${businessCount}`,
            count: businessCount,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.count = async (req, res) => {
  try {
    const count = await Business.countDocuments();
    return res.status(200).send({
      success: true,
      message: `List of businesses`,
      data: count,
      request: {
        type: "POST",
        url: "http://localhost:3000/api/sonic/user/login",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.search = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Query parameter is required" });
        }
        const businesses = await Business.find({
            $or: [
                { business_name: { $regex: query, $options: 'i' } },
                { location: { $regex: query, $options: 'i' } },
                { business_category: { $regex: query, $options: 'i' } }
            ]
        });
        if (businesses.length === 0) {
            return res.status(404).json({ message: "No businesses found matching your query" });
        }
        res.status(200).json({
            success: true,
            message: `Below is your searched data`,
            data: businesses,
            request: {
              type: "POST",
              url: "http://localhost:3000/api/sonic/user/login",
            },
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
