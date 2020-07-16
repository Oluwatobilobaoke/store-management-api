// const crypto = require("crypto");
const asyncHandler = require('express-async-handler');
const ErrorResponse = require('../utils/error-handler');
const User = require("../models/user");

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// Utility function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        payload: user,
    });
};          

// const nodemailer = require("nodemailer");
// const sendgridTransport = require("nodemailer-sendgrid-transport");

// const transporter = nodemailer.createTransport(
//   sendgridTransport({
//     auth: {
//       // api_key: Api key goes here..
//     }
//   })
// );

// Registers a user
exports.signUp = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, password, role, isAdmin } = req.body;

    if (role === 'admin')
        return next(new ErrorResponse('You cant signup as an admin', 400));

    // Create user
    const user = await User.create({
        firstName,
        lastName,
        email,
        isAdmin,
        password,
        role,
        cart: { items: [] }
    });

    sendTokenResponse(user, 200, res);
});


//  Logs in a user

//USER LogIn ALL USERS
exports.logIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});




//USER LOGoUT ALL USERS
exports.logOut = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        payload: {},
    });
});

// View Profile
exports.profile = asyncHandler(async (req, res, next) => {
    const profile = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        payload: profile,
    });
});

//Update Profile
exports.updateProfile = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        payload: user,
    });
});

// exports.passwordReset = (req, res, next) => {
//   crypto.randomBytes(32, (err, buffer) => {
//     if (err) res.status(402).send({ message: "something went wrong" });
//     const token = buffer.toString("hex");
//     console.log(req.body.email);
//     User.findOne({ email: req.body.email })
//       .then(user => {
//         if (!user) {
//           res.status(404).send({ message: "aww sorry, user not found!" });
//         }
//         user.resetToken = token;
//         user.resetTokenExpiration = Date.now() + 3600000;
//         console.log(user.resetTokenExpiration);
//         return user.save();
//       })
//       .then(result => {
//         res
//           .status(200)
//           .send({ message: "Password reset link sent successfully" });
//         transporter.sendMail({
//           to: req.body.email,
//           from: "javascripters@gmail.com",
//           subject: "Password Reset",
//           html: `<p>You requested a password reset</p>
//                 <p>Please click this <a href="/https://localhost:3000/reset/${token}">link</a> to set a new password</p>
//           `
//         });
//       })
//       .catch(err => console.log(err));
//   });
// };

// exports.updatePassword = async (req, res, next) => {
//   const updatedPassword = req.body.password;
//   const userId = req.body.user_id;
//   const token = req.params.token;
//   try {
//     const user = await User.findOne({
//       resetToken: token,
//       resetTokenExpiration: { $gt: Date.now() },
//       _id: userId
//     });
//     if (!user) {
//       res.status(401).send({
//         message: "Invalid user credentials. Please review and retry"
//       });
//       return;
//     }
//     const hashedPassword = await bcrypt.hash(updatedPassword, 12);
//     user.password = hashedPassword;
//     user.resetToken = undefined;
//     user.resetTokenExpiration = undefined;
//     await user.save();
//     res.send({
//       message: "Password successfully updated!"
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };
