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
      const accessToken = jwt.sign(
        { id: savedUser._id, verified: false },
        process.env.JWT_KEY,
        { expiresIn: "30d" }
      );
      return res.status(201).json({
        success: true,
        // token: accessToken,
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
  const { identifier, password } = req.body;

  try {
    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "Phone number or email is required",
      });
    }

    const isEmail = emailRegex.test(identifier);
    const query = isEmail ? { email: identifier } : { phonenumber: identifier };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found using the ${
          isEmail ? "email" : "phone number"
        }`,
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "30d",
    });
    return res.status(200).json({
      success: true,
      message: "Login successful, token generated",
      token: accessToken,
      data: user,
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
