import User from '../models/user.js'
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
const { CLIENT_ID } = process.env;

const logIn = async (req, res, next) => {
    try {
        let { email, password } = req.body,
            userFound = await User.findOne({ email })

        if (!userFound) return res.json({ error: 'email incorrecto' })
        if (userFound.password !== password) return res.json({ error: 'contraseña incorrecta' })
        return res.json({ user_id: userFound.id })
    } catch (err) {
        next(err)
    }
}

const signUp = async (req, res, next) => {
    try {
        let { email, password } = req.body,
            alreadyExists = await User.findOne({ email })

        if (alreadyExists) return res.json({ error: 'email en uso' })

        const newUser = await User.create({
            email,
            password
        })

        return res.json({ user_id: newUser.id })
    } catch (err) {
        next(err)
    }
}

const verifyGoogle = async (token) => {
    const client = new OAuth2Client(CLIENT_ID);

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });

    return ticket.getPayload()
}

const google = async (req, res, next) => {
    try {
        let id = false
        const { token } = req.body,
            {
                email,
                picture,
                name,
                sub
            } = await verifyGoogle(token).catch(next)

        if (sub) {
            const userFound = await User.findOne({ user_id: sub });
            id = userFound.id

            if (!userFound) {
                const newUser = await User.create({
                    email,
                    picture,
                    name,
                    user_id: sub
                })
                id = newUser.id
                // return res.json({ message: 'approved', id: newUser.id });
            }
            // una vez autenticado el usuario, genero un jwt 
            // con un tiempo de expiración mayor al token de google
            const aux = { id, email, name, picture };
            const token = jwt.sign({ user: aux }, process.env.JWT_SECRET, {
                expiresIn: 1000 * 60 * 60 * 24 * 7,
            });

            //: enviarlo como cookie por headers
            return res.json({ message: 'approved', id, token });
            //? como accedo a la cookie desde el cliente?

        } else {
            return res.status(403).json({
                error: true,
                message: "Sesión expirada, vuelve a iniciar sesión",
                expiredToken: true,
            });
        }
    } catch (err) {
        next(err)
    }
}

const autoLogIn = async (req, res, next) => {
    try {

    } catch (err) {
        next(err)
    }
}

export {
    logIn,
    signUp,
    google
}