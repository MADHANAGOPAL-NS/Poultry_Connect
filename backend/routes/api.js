import express from 'express';
import Measurement from '../models/Measurement.js';
import PredictionHistory from '../models/PredictionHistory.js';
import HealthAlert from '../models/HealthAlert.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Authentication middleware wrapper
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No auth token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// --- Measurements ---
router.get('/measurements', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const measurements = await Measurement.find().sort({ recordedAt: -1 }).limit(limit);
    res.json(measurements);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- Predictions ---
router.get('/predictions', authMiddleware, async (req, res) => {
  try {
    const predictions = await PredictionHistory.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(predictions);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/predictions', authMiddleware, async (req, res) => {
  try {
    const newPrediction = new PredictionHistory({
      ...req.body,
      userId: req.userId
    });
    const saved = await newPrediction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- Health Alerts ---
router.get('/alerts', authMiddleware, async (req, res) => {
  try {
    // Assuming alerts are global or need to be linked to predictions 
    // This is simple boilerplate that can be refined
    const alerts = await HealthAlert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;
