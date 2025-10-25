import express from 'express';
import { listMeetups ,listMeetupsDetails } from './controllers/getMeetUp.mjs';
import { createMeetup } from './controllers/createMeetup.mjs';
import { register ,login } from './controllers/authController.mjs';

const router = express.Router();

router.post('/register', register); 
router.post('/login', login);   
router.get('/meetups', listMeetups);
router.get('/meetups/:id', listMeetupsDetails);
router.post('/meetups', createMeetup);
export default router;
