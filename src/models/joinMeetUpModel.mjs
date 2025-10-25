// src/models/joinMeetUpModel.mjs
import pool from '../../db/pool.mjs';

export async function attendMeetupQuery(userId, meetupId) {
  const query = `
    INSERT INTO attendees (user_id, meetup_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, meetup_id) DO NOTHING;
  `;
  try {
    await pool.query(query, [userId, meetupId]);
  } catch (err) {
    // kasta en slimmad error för kontrollerad serialisering ovan
    const e = new Error(`DB insert failed: ${err.message}`);
    throw e;
  }
}

export async function leaveMeetupQuery(userId, meetupId) {
  const query = `
    DELETE FROM attendees
    WHERE user_id = $1 AND meetup_id = $2
    RETURNING *;
  `;
  try {
    const result = await pool.query(query, [userId, meetupId]);
    return result.rowCount > 0;
  } catch (err) {
    const e = new Error(`DB delete failed: ${err.message}`);
    throw e;
  }
}
