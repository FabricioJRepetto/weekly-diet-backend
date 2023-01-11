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

        const token = jwt.sign({ user: userFound }, process.env.JWT_SECRET, {
            expiresIn: 1000 * 60 * 60 * 24 * 7,
        });

        return res.json({ id: userFound.id, token })
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
        const { token } = req.body,
            {
                email,
                picture,
                name,
                sub
            } = await verifyGoogle(token).catch(next)

        //! INTERCEPTAR CONEXIÓN DE MAMÁ
        const MAMA = '114606056523415868273',
            YO = '63adf4eedb0249db949917c4'
        if (sub === MAMA) {
            const user = await User.findById(YO),
                aux = { id: user.id, email, name, picture },
                token = jwt.sign({ user: aux }, process.env.JWT_SECRET, {
                    expiresIn: 1000 * 60 * 60 * 24 * 7,
                });
            return res.json({ message: 'approved', email, id: user.id, token });
        }

        if (sub) {
            const userFound = await User.findOne({ user_id: sub });
            let id = userFound?.id || false

            if (!userFound) {
                const newUser = await User.create({
                    email,
                    picture,
                    name,
                    user_id: sub
                })
                id = newUser.id
            }

            // una vez autenticado el usuario, genero un jwt 
            // con un tiempo de expiración mayor al token de google
            const aux = { id, email, name, picture };
            const token = jwt.sign({ user: aux }, process.env.JWT_SECRET, {
                expiresIn: 1000 * 60 * 60 * 24 * 7,
            });

            return res.json({ message: 'approved', email, id, token });
            // enviarlo como cookie por headers
            // como accedo a la cookie desde el cliente?
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

const verifyJWT = async (token) => {
    try {
        const userDecoded = jwt.verify(token, process.env.JWT_SECRET),
            userFound = await User.findById(userDecoded.user.id)

        return { user: userDecoded.user, userFound }
    } catch (err) {
        throw new Error(err)
    }
}

const autoLogIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        if (!token) return res.status(403).json({ error: true, message: "No token recibed" })

        const { user, userFound } = await verifyJWT(token)

        if (!userFound) return res.status(404).json({ error: true, message: "User not found" })

        return res.status(200).json({ message: 'Loged in succesfully', ...user })

    } catch (err) {
        if (err?.name === "TokenExpiredError")
            return res.status(403).json({
                error: true,
                message: "Session expired, login again",
                expiredToken: true,
            });
        next(err)
    }
}

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        if (!token) return res.status(403).json({ error: true, message: "No token recibed" })

        const { user, userFound } = await verifyJWT(token)

        if (!userFound) return res.status(404).json({ error: true, message: "User not found" })

        req.user = user

        next()
    } catch (err) {
        console.log(err);
        if (err?.name === "TokenExpiredError")
            return res.status(403).json({
                error: true,
                message: "Session expired, login again",
                expiredToken: true,
            });
        return res.status(401).json({ message: "Sin autorización" });
    }
}

export {
    logIn,
    signUp,
    google,
    autoLogIn,
    verifyToken
}