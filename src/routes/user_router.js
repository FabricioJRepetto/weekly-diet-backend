import { Router } from "express"
const router = Router()
import {
    logIn,
    signUp,
    google
} from "../controllers/user_controller.js"

router.post('/login', logIn)
router.post('/signup', signUp)
router.post('/googlelogin', google)

export { router }