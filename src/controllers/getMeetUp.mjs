import { getAllMeetups ,getMeetupDetails } from '../models/GetmeetUpmodel.mjs'


export async function listMeetups(req, res) {
  try {
    const search     = String(req.query?.search ?? '').trim();
    const date_filter= String(req.query?.date_filter ?? '').trim();
    const date_from  = String(req.query?.date_from ?? '').trim();
    const date_to    = String(req.query?.date_to ?? '').trim();



    const meetups = await getAllMeetups({
      search, dateFilter: date_filter, dateFrom: date_from, dateTo: date_to
    });

    res.status(200).json(meetups);
  } catch (e) {
    console.error('listMeetups error:', e);
    res.status(500).json({ message: 'Kunde inte hämta meetups.' });
  }
}

export async function listMeetupsDetails(req, res) {
    const meetupId = parseInt(req.params.id, 10);
    if (isNaN(meetupId)) {
        return res.status(400).json({ message: 'Ogiltigt ID.' });
    }

    try {
        const details = await getMeetupDetails(meetupId);
        if (!details) {
            return res.status(404).json({ message: 'Meetup hittades inte.' });
        }
        res.status(200).json(details);
    } catch (error) {
        res.status(500).json({ message: 'Kunde inte hämta detaljer.' });
    }
}
