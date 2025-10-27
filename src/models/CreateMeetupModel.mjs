// src/models/meetupModel.mjs
import pool from '../../db/pool.mjs';
export async function createMeetup({ title, description, location, date, time }) {
  const q = `
    INSERT INTO public.meetups (title, description, location, date, time)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, title, description, location, date, time;`;
  const { rows } = await pool.query(q, [title, description ?? null, location, date, time]);
  return rows[0];
}
