import { attendMeetupQuery, leaveMeetupQuery } from '../models/joinMeetUpModel.mjs';


export async function attendMeetup(req, res) {
    const meetupId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    if (isNaN(meetupId)) {
        return res.status(400).json({ message: 'Ogiltigt ID.' });
    }

    try {
        await attendMeetupQuery(userId, meetupId);
        res.status(200).json({ message: 'Anmälan lyckades.' });
    } catch (error) {
        res.status(500).json({ message: 'Kunde inte anmäla dig.' });
    }
}


export async function leaveMeetup(req, res) {
    const meetupId = parseInt(req.params.id, 10);
    const userId = req.user.userId; 

    if (isNaN(meetupId)) {
        return res.status(400).json({ message: 'Ogiltigt ID.' });
    }

    try {
        const success = await leaveMeetupQuery(userId, meetupId);
        if (!success) {

            return res.status(404).json({ message: 'Du var inte anmäld till denna meetup.' });
        }
        res.status(200).json({ message: 'Avregistrering lyckades.' });
    } catch (error) {
        res.status(500).json({ message: 'Kunde inte avregistrera dig.' });
    }
}