import { signUpSchema, signinSchema } from '../schemas/user.schema.js';

export const validateSignup = (req, res, next) => {
    try {
        signUpSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: error.errors,
        });
    }
};

export const validateSignin = (req, res, next) => {
    try {
        signinSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: error.errors,
        });
    }
};
