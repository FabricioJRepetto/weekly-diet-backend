import { Router } from "express"
const router = Router()
import {
    logIn,
    signUp,
    google,
    autoLogIn
} from "../controllers/user_controller.js"

router.get('/autologin', autoLogIn)
router.post('/login', logIn)
router.post('/signup', signUp)
router.post('/googlelogin', google)

export { router }