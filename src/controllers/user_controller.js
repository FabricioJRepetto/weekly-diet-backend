import User from '../models/user.js'
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
const { CLIENT_ID } = process.env;

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
            return res.json({
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
        if (!token) return res.json({ error: true, message: "No token recibed" })

        const { user, userFound } = await verifyJWT(token)

        if (!userFound) return res.json({ error: true, message: "User not found" })

        return res.status(200).json({ message: 'Loged in succesfully', ...user })

    } catch (err) {
        if (err?.name === "TokenExpiredError")
            return res.json({
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
        if (!token) return res.json({ error: true, message: "No token recibed" })

        const { user, userFound } = await verifyJWT(token)

        if (!userFound) return res.json({ error: true, message: "User not found" })

        req.user = user

        next()
    } catch (err) {
        console.log(err);
        if (err?.name === "TokenExpiredError")
            return res.json({
                error: true,
                message: "Session expired, login again",
                expiredToken: true,
            });
        return res.json({ message: "Sin autorización" });
    }
}

const userConfig = async (req, res, next) => {
    try {
        const { id } = req?.user
        if (!id) return res.json({ error: true, message: 'No user ID recibed' })

        const user = await User.findById(id)

        if (user && user?.config) {
            return res.json({ config: user.config })
        } else {
            if (!user) return res.json({ error: true, message: 'Usuario no encontrado' })

            const aux = {
                tutorials: {
                    activated: true,
                    mainMenu: true,
                    creationMenu: true,
                    history: true,
                    checkpoints: true,
                    customMeals: true
                },
                height: 0,
            }

            user.config = aux
            await user.save()

            return res.json({ config: aux })
        }
    } catch (err) {
        next()
    }
}

const updateConfig = async (req, res, next) => {
    try {
        const { id } = req?.user,
            { height, tutorial, plateStyle } = req?.body

        if (!id) return res.json({ error: true, message: 'No user ID recibed' })
        if (!height && !tutorial && !plateStyle) return res.json({ error: true, message: 'No update field specified' })

        const user = await User.findById(id)

        if (height) {
            user.config.height = height
            await user.save()
        } if (plateStyle) {
            user.config.plateStyle = !user.config.plateStyle
            await user.save()
        } else {
            if (tutorial === 'activated') {
                const flag = !user.config.tutorials.activated
                user.config.tutorials = {
                    activated: flag,
                    mainMenu: flag,
                    creationMenu: flag,
                    history: flag,
                    checkpoints: flag,
                    customMeals: flag
                }
                await user.save()

            } else {
                const flag = !user.config.tutorials[tutorial]
                user.config.tutorials[tutorial] = flag
                await user.save()
            }
        }
        return res.json({ config: user.config })

    } catch (err) {
        next(err)
    }
}

export {
    google,
    autoLogIn,
    verifyToken,
    userConfig,
    updateConfig
}