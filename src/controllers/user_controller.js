import User from '../models/user.js'

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

export {
    logIn,
    signUp
}