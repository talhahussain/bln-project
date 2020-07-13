const asyncHandler = require('../utils/catchAsync')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../model/userModel')

const signToken = id => {

     return jwt.sign({ id }, '6fba667fde18a78a07a7e54da807d69ee21619f0e844eed3ab27f1a763c4878b69ba42524d09bc9819cf0c90992442b5ba3a44d3cba431c9d9a5a713c2fe074e', {
         expiresIn: '30d'
     });
};
 
 // @desc      It will create JWTtoken for users and send response
const createSendJWTtoken = (user, statusCode, res) => {
 
     const token = signToken(user._id);
 
     // Adding Cookie option for future use and Web Based Portal etc.
     const cookieOptions = {
         expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
         httpOnly: true
     };
     res.cookie("token", token, cookieOptions);
 
     // Remove password from output for the API result
     user.password = undefined;
 
     res.status(statusCode).json({
         status: "success",
         token,
         user
     });
};
 

exports.register = asyncHandler(async (req,res,next) => {


     try {

          
          const user = await User.create({

               name: req.body.name,
               email: req.body.email,
               password: req.body.password,
               confirmPassword: req.body.password,
               role: req.body.role,
               address: req.body.address
          })

          const emailConfirmationToken = user.createEmailConfirmationToken();
          await user.save({ validateBeforeSave: false });

          res.status(201).json({

               status: "success",
               message: "Successfully registered! please confirm your email",
               data: user
          })
     }
     catch(err) {

          res.status(500).json({

               status: "fail",
               message: "Cannot register! Please try with another email",
               data: err
          })
     }
})

exports.confirmEmail = asyncHandler(async (req, res, next) => {

     // 1) Get user based on the token
     const hashedToken = crypto.createHash("sha512").update(req.params.token).digest("hex");
 
     const user = await User.findOne({
         emailConfirmationToken: hashedToken,
         confirmationTokenExpires: { $gt: Date.now() },
     });
 
     // 2) If token has not expired, and there is user, verify the account.
     if (!user) {
         return res.status(404).json({
               status: "fail",
               message: "User not found please register first or check your email"

         })
     }
     user.isVerified = true;
     user.emailConfirmationToken = undefined;
     user.confirmationTokenExpires = undefined;
     await user.save({ validateBeforeSave: false });
 
     res.status(200).json({
         status: 'success',
         message: 'Congratulations! your account has been successfully confirmed.'
     });
 })

exports.login = asyncHandler(async (req, res, next) => {

     const { email, password } = req.body;
 
     if (!email || !password) {
         return res.status(400).json({
              status: "fail",
              message: "Please provide email and password"
         })
     }
 
     const user = await User.findOne({ email }).select("+password +isVerified");

     if (!user || !(await user.correctPassword(password, user.password))) {
         return res.status(400).json({
              status: "fail",
              message: "Incorrect email or password"
         })
     }
 
     // 3) Check if user's email is verified.
     if (!user.isVerified){
          return res.status(400).json({
               status: "fail",
               message: "Please verify email first to login"
          })
     }
 
     // 4) If everything ok, Log the user in, send JWT token to client
     createSendJWTtoken(user, 200, res);
});
 