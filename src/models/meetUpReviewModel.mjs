import pool from '../../db/pool.mjs';
export async function addOrUpdateReview(userId, meetupId, rating, comment) {
    const query = `
        INSERT INTO reviews (user_id, meetup_id, rating, comment)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, meetup_id) DO UPDATE SET
            rating = EXCLUDED.rating,
            comment = EXCLUDED.comment,
            updated_at = NOW()
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [userId, meetupId, rating, comment]);
    return rows[0];
}


export async function getMeetupReviews(meetupId) {
    const query = `
        SELECT 
            r.id, r.rating, r.comment, r.created_at, u.username AS reviewer_username
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.meetup_id = $1
        ORDER BY r.created_at DESC;
    `;
    const { rows } = await pool.query(query, [meetupId]);
    return rows;
}