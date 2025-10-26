import pool from '../../db/pool.mjs';

export async function getUserProfile(userId) {

    const userQuery = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [userId]);
    

    if (userResult.rows.length === 0) return null;
    const user = userResult.rows[0];

    const historyQuery = `
        SELECT 
            m.id AS meetup_id,
            m.title,
            m.date,
            r.rating, -- Betyg de gett
            r.comment -- Kommentar de gett
        FROM attendees a
        JOIN meetups m ON a.meetup_id = m.id
        LEFT JOIN reviews r ON a.meetup_id = r.meetup_id AND a.user_id = r.user_id
        WHERE a.user_id = $1
        ORDER BY m.date DESC;
    `;
    const historyResult = await pool.query(historyQuery, [userId]);


    return {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        history: historyResult.rows 
    };
}