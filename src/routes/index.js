import { Router } from "express"
const router = Router()
import { router as userRouter } from "./user_router.js"
import { router as historyRouter } from "./history_router.js"
import { verifyToken } from "../controllers/user_controller.js"

router.use('/sensei', (req, res, next) => {
    res.send('el facusama te bendice')
})

router.use('/user', userRouter)
router.use('/history', verifyToken, historyRouter)

export default router