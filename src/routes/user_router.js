import { Router } from "express"
const router = Router()
import {
    logIn,
    signUp
} from "../controllers/user_controller.js"

router.post('/login', logIn)
router.post('/signup', signUp)

export { router }