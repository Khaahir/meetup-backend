import { addOrUpdateReview, getMeetupReviews } from '../models/meetUpReviewModel.mjs';
export async function addReview(req, res) {
    const meetupId = parseInt(req.params.id, 10);
    const userId = req.user.userId;
    const { rating, comment } = req.body;

    if (isNaN(meetupId) || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Betyg måste vara 1-5.' });
    }

    try {
        const review = await addOrUpdateReview(userId, meetupId, rating, comment);
        res.status(201).json({ message: 'Recension sparad.', review });
    } catch (error) {
        res.status(500).json({ message: 'Kunde inte spara recensionen.' });
    }
}


export async function getReviews(req, res) {
    const meetupId = parseInt(req.params.id, 10);
    if (isNaN(meetupId)) {
        return res.status(400).json({ message: 'Ogiltigt ID.' });
    }

    try {
        const reviews = await getMeetupReviews(meetupId);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Kunde inte hämta recensioner.' });
    }
}