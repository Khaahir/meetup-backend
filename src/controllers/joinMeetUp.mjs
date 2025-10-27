
import { attendMeetupQuery, leaveMeetupQuery } from '../models/joinMeetUpModel.mjs';

export async function attendMeetup(req, res) {
  const meetupId = parseInt(req.params.id, 10);
  const userId = req.user?.userId;

  if (!Number.isInteger(meetupId)) {
    return res.status(400).json({ message: 'Ogiltigt ID.' });
  }
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const r = await attendMeetupQuery(userId, meetupId);

    if (!r.ok && r.reason === 'not_found') {
      return res.status(404).json({ message: 'Meetup hittades inte.' });
    }
    if (!r.ok && r.reason === 'full') {
      return res.status(409).json({ message: 'Meetup är full.' });
    }
    if (r.ok && r.already) {
      return res.status(200).json({ message: 'Redan anmäld.' });
    }
    return res.status(200).json({ message: 'Anmälan lyckades.' });
  } catch (error) {
    return res.status(500).json({ message: 'Kunde inte anmäla dig.' });
  }
}

export async function leaveMeetup(req, res) {
  const meetupId = parseInt(req.params.id, 10);
  const userId = req.user?.userId;

  if (!Number.isInteger(meetupId)) {
    return res.status(400).json({ message: 'Ogiltigt ID.' });
  }
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const success = await leaveMeetupQuery(userId, meetupId);
    if (!success) {
      return res.status(404).json({ message: 'Du var inte anmäld till denna meetup.' });
    }
    return res.status(200).json({ message: 'Avregistrering lyckades.' });
  } catch (error) {
    return res.status(500).json({ message: 'Kunde inte avregistrera dig.' });
  }
}
