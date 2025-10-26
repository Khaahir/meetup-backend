import * as profileModel from '../models/profileModel.mjs';


export async function getProfile(req, res) {
    const userId = req.user.userId; // Från token (authMiddleware)

    try {
        const profile = await profileModel.getUserProfile(userId);
        
        if (!profile) {
            return res.status(404).json({ message: 'Användaren hittades inte.' });
        }

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Kunde inte hämta profilen.' });
    }
}