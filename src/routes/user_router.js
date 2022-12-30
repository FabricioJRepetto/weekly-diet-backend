import { Router } from "express"
const router = Router()
import {
    logIn,
    signUp,
    google,
    autoLogIn
} from "../controllers/user_controller.js"

router.post('/login', logIn)
router.post('/signup', signUp)
router.post('/googlelogin', google)
router.get('/autologin', autoLogIn)

export { router }