import pool from "../../db/pool.mjs";

export async function deleteMeetupModel(meetupId, userId) {
    const res = await pool.query(
        `
        DELETE FROM meetups
        WHERE ID  = $1 AND creator_id = $2
        RETURNING id
        `,
        [meetupId, userId]
    )
     return res.rowCount > 0;
}