import { Router, Request, Response } from 'express';
import Profile from '../models/profileModel';
import mongoose from 'mongoose';

const router = Router();

// POST /profile
// Create a new profile
router.post('/profile/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, subjectRatings, constraints } = req.body;

  if (!name || !subjectRatings || !constraints) {
    res.status(400).json({ message: 'Name, subject ratings, and constraints are required' });
    return;
  }

  const newProfile = new Profile({
    _id: userId,  // Use the provided userId as the document's _id in MongoDB
    name,
    subjectRatings,
    constraints
  });

  newProfile.save()
    .then((profile) => {
      console.log(`Profile saved to DB: ${mongoose.connection.name}`); 
      res.status(201).json({ message: 'Profile created successfully', profile });
      return;
    })
    .catch((err) => {
      if (err.code === 11000) {  // Catch duplicate _id errors
        res.status(400).json({ message: 'Profile with this userId already exists' });
      } else {
        res.status(500).json({ message: 'Server error', error: err.message });
      }
      return;
    });
});

// GET /profile/:userId
// Retrieve a profile by userId
router.get('/profile/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;

  Profile.findById(userId)
    .then((profile) => {
      if (profile) {
        res.json(profile);
        return;
      } else {
        res.status(404).json({ message: 'Profile not found' });
        return;
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Server error', error: err.message });
      return;
    });
});

// PUT /profile/:userId
// Update an existing profile by userId
router.put('/profile/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, subjectRatings, constraints } = req.body;

  if (!name || !subjectRatings || !constraints) {
    res.status(400).json({ message: 'Name, subject ratings, and constraints are required' });
    return;
  }

  Profile.findById(userId)
    .then((profile) => {
      if (profile) {
        // Update existing profile
        profile.name = name;
        profile.subjectRatings = subjectRatings;
        profile.constraints = constraints;
        return profile.save();
      } else {
        res.status(404).json({ message: 'Profile not found' });
        return Promise.reject(new Error('Profile not found'));
      }
    })
    .then((updatedProfile) => {
      res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
      return;
    })
    .catch((err) => {
      res.status(500).json({ message: 'Server error', error: err.message });
      return;
    });
});

export default router;
