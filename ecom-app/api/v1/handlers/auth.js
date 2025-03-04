
const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../../../errors/index');
const sendOTP = require('../../../utils/sendOTP');
const jwt = require("jsonwebtoken");
const redisClient = require('../../../db/redis');

// Register
const register = async(req, res,next) => {
  try{

  const { name, email, password, role, phoneNumber, country} = req.body;
  // const user = await User.create({ ...req.body })

  const checkUsername = await User.findOne({
    name: req.body.name,
  });

  const checkUserEmail = await User.findOne({
    email: req.body.email,
  });

  if (checkUsername) {
    return res.status(401).json({ message: "Name is already in use!" });

  } else if (checkUserEmail) {
    return res.status(401).json({ message: "Email is already in use!" });

  }else{

    await User.create({
     name,
     email,
     password,
     role,
     phoneNumber,
     country,
   });
  
   const newUser = {
     name,
     email,
     role,
     phoneNumber,
     country,
   }

   // Send OTP
  // await sendOTP(user, preferredMethod);

   const accessToken = jwt.sign(
     {
       id:  req.body._id,
     },
     process.env.SECRET_KEY,
     { expiresIn: "60d" }
   );

    // Return null data since isVerified is false
    const responseData = req.body.isVerified
    ? {accessToken,...newUser}
    : null;

    res.status(StatusCodes.CREATED).json({
      success:true,
      message: 'User created. Please verify OTP sent to your email.',
      data: responseData,
    });


  }

  }catch(e){

    res.status(500).json(e);

  }

};


// Login
const login = async (req, res) => {

  try{

    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(401).json('Please provide email and password');
    }
  
    const user = await User.findOne({ email }).select('+password');
  
    if (!user) {
      return res.status(401).json({success: false,message:'Invalid Credentials'});
    }
  
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({success: false,message:'Invalid password'});
    }
  
    // if (!user.isVerified) {
    //   throw new UnauthenticatedError('Please verify your account first');
    // }

    // const newUser = {user}
    const newUser = {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      country: user.country,
    };

    // console.log(newUser)
  
    const accessToken = jwt.sign(
      {
        id:  req.body._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "60d" }
    );

    const responseData = !req.body.isVerified
    ? {accessToken,...newUser}
    : null;

    res.status(StatusCodes.CREATED).json({
      success:true,
      message: !req.body.isVerified ? 'Please verify OTP sent to your email.': 'logged in successfully',
      data: responseData,
    });

  }catch(e){

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);

  }
};



// Verify OTP
const verifyOTP = async (req, res) => {

  try{
    
    const { email, otp } = req.body;
  
    if (!email || !otp) {
      // throw new BadRequestError('Please provide email and OTP');
      return res.status(401).json({success: false,message:'Please provide email and OTP'});
    }
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({success: false,message:'Invalid Credentials'});
  
      
    }
  
    const storedOTP = await redisClient.get(`otp:${email}`);
    if (!storedOTP || storedOTP !== otp) {
      return res.status(401).json({success: false,message:'Invalid or expired OTP'});
  
    }
  
    user.isVerified = true;
    await user.save();
  
    // Clear OTP from Redis
    await redisClient.del(`otp:${email}`);
  
  
    const accessToken = jwt.sign(
      {
        id:  req.body._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "60d" }
    );
  
    res.status(StatusCodes.OK).json({
      data: { id: user._id, name: user.name, role: user.role, country: user.country },
      accessToken,
      message: 'Account verified successfully',
    });
  }catch(e){
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);

  }
};



// Change Password
const changePassword = async (req, res) => {

  try{

    const { oldPassword, newPassword } = req.body;
    
    const userId = req.user.userId; // From auth middleware
  
    if (!oldPassword || !newPassword) {
      throw new BadRequestError('Please provide old and new passwords');
    }
  
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new UnauthenticatedError('User not found');
    }
  
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Incorrect old password');
    }
  
    user.password = newPassword; // Pre-save hook will hash it
    await user.save();
  
    res.status(StatusCodes.OK).json({ message: 'Password changed successfully' });

  }catch(e){

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);

  }
};


module.exports = {
  register,
  login,
  verifyOTP,
  changePassword,
};