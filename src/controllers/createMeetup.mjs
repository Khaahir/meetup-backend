import { createMeetup as createMeetupModel } from '../models/CreateMeetupModel.mjs';

export async function createMeetup(req, res) {
  try {

    const userId = req.user?.userId ?? req.user?.id; 
    if (!userId) return res.status(401).json({ message: 'No token' });

    const { title, description, location, date, time, capacity } = req.body || {};
    if (!title || !location || !date || !time)
      return res.status(400).json({ message: 'title, location, date och time krävs.' });

    const isValidDate = !isNaN(Date.parse(date));
    const isValidTime = /^\d{2}:\d{2}(:\d{2})?$/.test(time);
    if (!isValidDate || !isValidTime)
      return res.status(400).json({ message: 'Ogiltigt datum- eller tidsformat.' });

    const row = await createMeetupModel({
      title,
      description,
      location,
      date,
      time,
      creator_id: Number(userId),
      capacity: capacity ?? null,
    });

    return res.status(201).json(row);
  } catch (err) {
    console.error('createMeetup error:', { message: err.message, code: err.code, detail: err.detail });
    return res.status(500).json({ message: 'Kunde inte skapa meetup.' });
  }
}
