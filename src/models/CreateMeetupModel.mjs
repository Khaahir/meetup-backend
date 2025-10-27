// src/models/meetupModel.mjs
import pool from '../../db/pool.mjs';


export async function createMeetup({ title, description, location, date, time, creator_id, capacity }) {
  const result = await pool.query(
    `
    INSERT INTO meetups (title, description, location, date, time, creator_id, capacity)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, title, description, location, date, time, creator_id, capacity
    `,
    [title, description ?? null, location, date, time, creator_id, capacity]
  );
  return result.rows[0];
}
