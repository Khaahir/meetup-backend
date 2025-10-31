import { deleteMeetupModel } from '../models/deleteMeetupModel.mjs';

export async function deleteMeetup(req, res) {
  const meetupId = Number(req.params.id);
  const userId = req.user?.userId ?? req.user?.id; 

  if (!Number.isInteger(meetupId)) {
    return res.status(400).json({ message: 'Ogiltigt ID' });
  }
  if (!userId) {
    return res.status(401).json({ message: 'No token' });
  }

  try {
    const deleted = await deleteMeetupModel(meetupId, Number(userId));
    if (!deleted) {

      return res.status(403).json({ message: 'Du får inte ta bort denna meetup.' });
    }
    return res.status(200).json({ message: 'Meetup borttagen.' });
  } catch (err) {
    console.error('deleteMeetup error:', err);
    return res.status(500).json({ message: 'Kunde inte ta bort meetup.' });
  }
}
