const User = require("./model");
const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");

// Regular expressions for email and phone number validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;

exports.user_signup = async (req, res) => {
	const userdata = {
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email,
		password: req.body.password,
		phonenumber: req.body.phonenumber,
	};

	try {
		const userExist = await User.findOne({ email: req.body.email });
		if (userExist) {
			return res.status(409).json({
				success: false,
				message: "Email already exists",
			});
		}

		const newUser = new User(userdata);
		const savedUser = await newUser.save();

		if (savedUser) {
			const accessToken = jwt.sign(
				{ id: savedUser._id, verified: false },
				process.env.JWT_KEY,
				{ expiresIn: "30d" }
			);
			return res.status(201).json({
				success: true,
				token: accessToken,
				data: savedUser,
				request: {
					type: "POST",
					url: "http://localhost:3000/api/sonic/user/signup",
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

exports.user_login = async (req, res) => {
	const { identifier, password } = req.body;

	try {
		if (!identifier) {
			return res.status(400).json({
				success: false,
				message: "Phone number or email is required",
			});
		}

		const isEmail = emailRegex.test(identifier);
		const query = isEmail
			? { email: identifier }
			: { phonenumber: identifier };
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

exports.update_user = async (req, res) => {
  const { user_id } = req.params; // User ID from request params
  const { firstname, lastname, email, phonenumber } = req.body; // Updated data

  try {
    // Validate email and phone number (if present in the request body)
    if (email && !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }
    // Find the user by ID and update the provided fields
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      {
        $set: {
          firstname,
          lastname,
          email,
          phonenumber,
        },
      },
      { new: true, runValidators: true } // Return the updated user, and run validators on updated fields
    );

    // Check if user exists
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
      request: {
        type: "PUT",
        url: `http://localhost:3000/api/sonic/user/${user_id}`,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.change_password = async (req, res) => {
  const { user_id } = req.params; // Extract user_id from URL parameters
  const { new_password } = req.body; // Extract new password from request body

  try {
    // Find the user by their ID
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate that newPassword is provided
    if (!new_password) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    // Update the password field with the new password
    user.password = new_password; // In a real app, you'd hash the password here!

    // Save the updated user document
    await user.save();

    // Return a success message
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.delete_account = async (req, res) => {
  const { userId } = req.params; // Extract userId from URL parameters

  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete the user account
    await User.findByIdAndDelete(userId);

    // Return a success message
    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
