const Business = require("./model");
const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");

// Regular expressions for email and phone number validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;

exports.list_business = async (req, res) => {
  const userdata = {
    business_id: req.body.business_id,
    business_name: req.body.business_name,
    location: req.body.location,
    business_owner: req.body.business_owner,
    business_description: req.body.business_description,
    product: req.body.product,
    review: req.body.review,
  };

  try {
    const userExist = await Business.findOne({
      email: req.body.business_name,
    });
    if (userExist) {
      return res.status(409).json({
        success: false,
        message: "Business Name already exists",
      });
    }

    const newUser = new Business(userdata);
    const savedUser = await newUser.save();

    if (savedUser) {
      return res.status(201).json({
        success: true,
        data: savedUser,
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
