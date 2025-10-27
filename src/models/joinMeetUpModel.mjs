// src/models/joinMeetUpModel.mjs
import pool from '../../db/pool.mjs';

export async function attendMeetupQuery(userId, meetupId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const mRes = await client.query(
      `SELECT id, capacity FROM meetups WHERE id = $1 FOR UPDATE`,
      [meetupId]
    );
    if (mRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return { ok: false, reason: 'not_found' };
    }
    const { capacity } = mRes.rows[0];


    const exists = await client.query(
      `SELECT 1 FROM attendees WHERE user_id = $1 AND meetup_id = $2`,
      [userId, meetupId]
    );
    if (exists.rowCount > 0) {
      await client.query('ROLLBACK');
      return { ok: true, already: true };
    }

    if (capacity !== null && capacity !== undefined) {
      const c = await client.query(
        `SELECT COUNT(*)::int AS count FROM attendees WHERE meetup_id = $1`,
        [meetupId]
      );
      if (c.rows[0].count >= capacity) {
        await client.query('ROLLBACK');
        return { ok: false, reason: 'full' };
      }
    }

    await client.query(
      `INSERT INTO attendees (user_id, meetup_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, meetup_id) DO NOTHING`,
      [userId, meetupId]
    );

    await client.query('COMMIT');
    return { ok: true };
  } catch (err) {
    await client.query('ROLLBACK');
    throw new Error(`DB attend failed: ${err.message}`);
  } finally {
    client.release();
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
    throw new Error(`DB leave failed: ${err.message}`);
  }
}
