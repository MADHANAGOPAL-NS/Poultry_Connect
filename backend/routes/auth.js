import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import UserRole from '../models/UserRole.js';
import BuyerProfile from '../models/BuyerProfile.js';
import SellerProfile from '../models/SellerProfile.js';
import PredictionHistory from '../models/PredictionHistory.js';
import sendVerificationEmail from '../utils/sendEmail.js';

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, profileData } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    
    // Generate Verification Token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user = new User({ 
      email, 
      password: hashedPassword,
      verificationToken
    });
    await user.save();
    
    // Create UserRole
    const userRole = new UserRole({ userId: user._id, role: role || 'buyer' });
    await userRole.save();

    // Create correct profile
    if (role === 'buyer') {
      const buyerProfile = new BuyerProfile({ userId: user._id, ...profileData });
      await buyerProfile.save();
    } else if (role === 'seller') {
      const sellerProfile = new SellerProfile({ userId: user._id, ...profileData });
      await sellerProfile.save();
    }

    // Try sending email
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await sendVerificationEmail(email, verificationToken);
      } else {
        console.warn('Skipping email verification send - EMAIL_USER/EMAIL_PASS not configured in .env');
        // By default, auto verify if mailer isn't setup for easier dev testing
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
      }
    } catch (e) {
      console.error('Email send failed:', e);
    }
    
    // Sign JWT regardless for auto-signin but warn them if email was sent
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: user._id, email: user.email, isVerified: user.isVerified, user_metadata: user.user_metadata } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    if (!user.isVerified && process.env.EMAIL_USER) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    // Sign JWT
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: user._id, email: user.email, user_metadata: user.user_metadata } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Verify Session Route (To keep user logged in on refresh)
router.get('/session', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ message: 'Token is not valid' });
    
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
});

// Verification Route 
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Missing token' });

    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid or expired confirmation link' });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete Account Route
router.delete('/delete', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No auth token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Delete user
    await User.findByIdAndDelete(userId);
    
    // Delete associated data
    await UserRole.findOneAndDelete({ userId });
    await BuyerProfile.findOneAndDelete({ userId });
    await SellerProfile.findOneAndDelete({ userId });
    await PredictionHistory.deleteMany({ userId });
    
    res.json({ message: 'Account and associated data deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error during deletion' });
  }
});

// Update Profile Route
router.put('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No auth token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { full_name, avatar_url } = req.body;
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (!user.user_metadata) {
      user.user_metadata = { full_name: '', avatar_url: '' };
    }
    
    if (full_name !== undefined) user.user_metadata.full_name = full_name;
    if (avatar_url !== undefined) user.user_metadata.avatar_url = avatar_url;
    
    await user.save();
    
    res.json({ message: 'Profile updated successfully', user_metadata: user.user_metadata });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

// Update Password Route
router.put('/password', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No auth token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { password } = req.body;
    
    if (!password) return res.status(400).json({ message: 'Password is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user.password = hashedPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error during password update' });
  }
});

export default router;
