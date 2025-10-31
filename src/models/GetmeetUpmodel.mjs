import pool from '../../db/pool.mjs';

export async function getAllMeetups({
  search = '',
  dateFilter = '',
  dateFrom = '',
  dateTo = '',
} = {}) {
  let query = `
    SELECT
      m.id,
      m.title,
      m.description,
      m.location,
      m.date,
      m.time,
      m.capacity,
      m.creator_id,
      u.username AS creator_username,
      (
        SELECT COUNT(*)
        FROM public.attendees a
        WHERE a.meetup_id = m.id
      ) AS attendees_count
    FROM public.meetups m
    LEFT JOIN public.users u ON m.creator_id = u.id
  `;

  const params = [];
  const where = [];

  const term = String(search).trim();
  if (term) {
    params.push(term);
    const idx = params.length;
    where.push(
      `(m.title ILIKE '%' || $${idx} || '%'
        OR m.description ILIKE '%' || $${idx} || '%'
        OR m.location ILIKE '%' || $${idx} || '%')`
    );
  }

  if (dateFilter === 'upcoming') where.push('m.date >= CURRENT_DATE');
  if (dateFilter === 'past')     where.push('m.date < CURRENT_DATE');

  if (dateFrom) {
    params.push(dateFrom);
    where.push(`m.date >= $${params.length}`);
  }
  if (dateTo) {
    params.push(dateTo);
    where.push(`m.date <= $${params.length}`);
  }

  if (where.length) {
    query += ' WHERE ' + where.join(' AND ');
  }


  query += ' ORDER BY m.date ASC, m.time ASC NULLS LAST';

  const { rows } = await pool.query(query, params);
  return rows;
}

export async function getMeetupDetails(meetupId) {
  const query = `
    WITH base AS (
      SELECT
        m.id,
        m.title,
        m.description,
        m.location,
        m.date,
        m.time,
        m.capacity,
        m.creator_id,
        (
          SELECT COUNT(*)
          FROM public.attendees at2
          WHERE at2.meetup_id = m.id
        ) AS attendees_count
      FROM public.meetups m
      WHERE m.id = $1
    )
    SELECT
      b.id,
      b.title,
      b.description,
      b.location,
      b.date,
      b.time,
      b.capacity,
      b.creator_id,
      b.attendees_count,

      -- skaparen
      cu.id       AS creator_user_id,
      cu.username AS creator_username,

      -- deltagare
      u.id        AS attendee_id,
      u.username  AS attendee_username
    FROM base b
    LEFT JOIN public.users cu      ON b.creator_id = cu.id          -- skaparen
    LEFT JOIN public.attendees a   ON b.id = a.meetup_id            -- deltagare
    LEFT JOIN public.users u       ON a.user_id = u.id;
  `;

  const { rows } = await pool.query(query, [meetupId]);

  if (rows.length === 0) {
    return null;
  }

  const first = rows[0];

  return {
    id: first.id,
    title: first.title,
    description: first.description,
    location: first.location,
    date: first.date,
    time: first.time,
    capacity: first.capacity,
    attendees_count: first.attendees_count,

    creator: first.creator_user_id
      ? {
          user_id: first.creator_user_id,
          username: first.creator_username,
        }
      : null,

    attendees: rows
      .filter(r => r.attendee_id)
      .map(r => ({
        user_id: r.attendee_id,
        username: r.attendee_username,
      })),
  };
}
