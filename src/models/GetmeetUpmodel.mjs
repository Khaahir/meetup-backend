import pool from '../../db/pool.mjs';

export async function getAllMeetups({ search = '', dateFilter = '', dateFrom = '', dateTo = '' } = {}) {
  let query = `
    SELECT id, title, description, location, date, time
    FROM public.meetups
  `;
  const params = [];
  const where = [];

  const term = String(search).trim();
  if (term) {
    params.push(term);
    const idx = params.length;
    where.push(
      `(title ILIKE '%' || $${idx} || '%' OR description ILIKE '%' || $${idx} || '%' OR location ILIKE '%' || $${idx} || '%')`
    );
  }

  if (dateFilter === 'upcoming') where.push('date >= CURRENT_DATE');
  if (dateFilter === 'past')     where.push('date <  CURRENT_DATE');

  if (dateFrom) { params.push(dateFrom); where.push(`date >= $${params.length}`); }
  if (dateTo)   { params.push(dateTo);   where.push(`date <= $${params.length}`); }

  if (where.length) query += ' WHERE ' + where.join(' AND ');
  query += ' ORDER BY date ASC, time ASC';

  const { rows } = await pool.query(query, params);
  return rows;
}

export async function getMeetupDetails(meetupId) {
    const query = `
      SELECT id, title, description, location, date, time
    FROM public.meetups
    WHERE id = $1
    `;
    const { rows } = await pool.query(query, [meetupId]);


    if (rows.length === 0) return null;


    const details = {
        id: rows[0].id,
        title: rows[0].title,
        description: rows[0].description,
        location: rows[0].location,
        date: rows[0].date,
        time: rows[0].time,

        attendees: rows
            .filter(row => row.attendee_id) 
            .map(row => ({
                user_id: row.attendee_id,
                username: row.attendee_username
            }))
    };
    return details;
}