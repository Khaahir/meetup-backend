import pool from '../../db/pool.mjs'
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; 

export async function registerUser(username, email, password) {
    try {

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        
        const query = `
            INSERT INTO users (username, email, password_hash)
            VALUES ($1, $2, $3)
            ON CONFLICT (email) DO NOTHING
            RETURNING id, username, email;
        `;
        const { rows } = await pool.query(query, [username, email, hashedPassword]);
        
        return rows[0] || null; 
    } catch (error) {
        console.error('DB fel vid registrering:', error);
        throw new Error('Kunde inte registrera användare i databasen.');
    }
}

export async function loginUserByEmail(email) {
    const query = `
        SELECT id, username, email, password_hash FROM users WHERE email = $1;
    `;
    const { rows } = await pool.query(query, [email]);

    return rows[0] || null;
}


export async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}