import express from 'express';
import { listMeetups ,listMeetupsDetails } from './controllers/getMeetUp.mjs';
import { createMeetup } from './controllers/createMeetup.mjs';
import { register ,login } from './controllers/authController.mjs';
import { attendMeetup ,leaveMeetup } from './controllers/joinMeetUp.mjs';
import { addReview, getReviews } from './controllers/meetUpReview.mjs';
import authMiddleware from './middleware/authMiddleware.mjs';
import { getProfile } from './controllers/profilecontroller.mjs';

const router = express.Router();

router.post('/register', register); 
router.post('/login', login);   


router.get('/meetups', authMiddleware, listMeetups);
router.get('/meetups/:id', authMiddleware, listMeetupsDetails);
router.post('/meetups',authMiddleware, createMeetup);


router.post('/meetups/:id/attend' , authMiddleware , attendMeetup)
router.delete('/meetups/:id/attend' , authMiddleware , leaveMeetup)


router.get('/meetups/:id/review' ,authMiddleware, getReviews);
router.post('/meetups/:id/review', authMiddleware, addReview);

router.get('/profile', authMiddleware, getProfile);


export default router;
