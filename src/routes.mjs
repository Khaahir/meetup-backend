import express from 'express';
import { listMeetups ,listMeetupsDetails } from './controllers/getMeetUp.mjs';
import { createMeetup } from './controllers/createMeetup.mjs';
import { register ,login } from './controllers/authController.mjs';
import { attendMeetup ,leaveMeetup } from './controllers/joinMeetUp.mjs';
import authMiddleware from './middleware/authMiddleware.mjs';

const router = express.Router();

router.post('/register', register); 
router.post('/login', login);   


router.get('/meetups', authMiddleware, listMeetups);
router.get('/meetups/:id', authMiddleware, listMeetupsDetails);
router.post('/meetups',authMiddleware, createMeetup);


router.post("/meetups/:id/attend" , authMiddleware , attendMeetup)
router.delete("/meetups/:id/attend" , authMiddleware , leaveMeetup)

export default router;
