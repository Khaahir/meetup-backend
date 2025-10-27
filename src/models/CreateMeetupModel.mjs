// src/models/meetupModel.mjs
import pool from '../../db/pool.mjs';

export async function createMeetup({
  title,
  description,
  location,
  date,
  time,
  creator_id,
  capacity
}) {
  const sql = `
    WITH ins AS (
      INSERT INTO meetups (title, description, location, date, time, creator_id, capacity)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, title, description, location, date, time, creator_id, capacity
    )
    SELECT
      i.id, i.title, i.description, i.location, i.date, i.time,
      i.creator_id, i.capacity,
      u.username AS creator_name,   -- byt till rätt kolumn om du använder t.ex. "name" / "full_name"
      u.email    AS creator_email   -- valfritt
    FROM ins i
    LEFT JOIN users u ON u.id = i.creator_id;
  `;

  const params = [
    title,
    description ?? null,
    location,
    date,
    time,
    Number(creator_id),
    capacity ?? 35
  ];

  const { rows } = await pool.query(sql, params);
  return rows[0];
}
