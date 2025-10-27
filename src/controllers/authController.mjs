import * as userModel from '../models/usermodel.mjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_LIFETIME = '24h'; 


const generateToken = (user) => {
    return jwt.sign(
        { userId: user.id, username: user.username }, 
        JWT_SECRET, 
        { expiresIn: JWT_LIFETIME }
    );
};


export async function register(req, res) {
    const { username, email, password } = req.body;


    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Fyll i alla fält.' });
    }

    try {
        const newUser = await userModel.registerUser(username, email, password);
        

        if (!newUser) {
            return res.status(409).json({ message: 'E-postadressen används redan.' });
        }
        

        const token = generateToken(newUser);


        res.status(201).json({ 
            user: { id: newUser.id, username: newUser.username }, 
            token 
        });
    } catch (error) {

        res.status(500).json({ message: 'Ett serverfel uppstod.' });
    }
}


export async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'E-post och lösenord krävs.' });
    }

    try {
        const user = await userModel.loginUserByEmail(email);
        

        if (!user) {
            return res.status(401).json({ message: 'Fel e-post eller lösenord.' });
        }


        const isMatch = await userModel.comparePassword(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Fel e-post eller lösenord.' });
        }


        const token = generateToken(user);

        res.status(200).json({ 
            user: { id: user.id, username: user.username }, 
            token 
        });
    } catch (error) {
        res.status(500).json({ message: 'Ett serverfel uppstod vid inloggning.' });
    }
}