import db from '../lib/db.js';
import bcrypt from 'bcryptjs';
import { signUpSchema, signinSchema } from '../schemas/user.schema.js';
import { generateToken } from '../lib/generateToken.js';

export const checkController = async (req, res) => {
    try {
        const user = req?.user;
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'No user found' });
    }
};

export const logoutController = (req, res) => {
    try {
        res.clearCookie('jwt');
        res.status(200).json({ message: 'Successfully logged out' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const signinController = async (req, res) => {
    const { email, password } = req.body;

    try {
        signinSchema.parse({ email, password });

        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'No user with provided email' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Wrong password' });
        }

        const token = generateToken(user.id, res);

        return res.status(200).json({
            message: 'Signin successful',
            user: { id: user.id, name: user.name, email: user.email },
            token: token,
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: error.format ? error.format() : error.message,
        });
    }
};

export const signupController = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        signUpSchema.parse({ name, email, password });

        const existingUser = await db.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({ data: { name, email, password: hashedPass } });

        const token = generateToken(newUser.id, res);

        return res.status(200).json({
            message: 'Signup successful',
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
            token: token,
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: error.format ? error.format() : error.message,
        });
    }
};
