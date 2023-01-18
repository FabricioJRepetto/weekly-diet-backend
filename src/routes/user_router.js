import { Router } from "express"
const router = Router()
import {
    google,
    autoLogIn,
    verifyToken,
    userConfig,
    updateConfig
} from "../controllers/user_controller.js"

router.get('/autologin', autoLogIn)
router.get('/config', verifyToken, userConfig)
router.put('/config', verifyToken, updateConfig)
router.post('/googlelogin', google)

export { router }