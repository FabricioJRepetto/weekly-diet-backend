import { Router } from "express"
const router = Router()
import { router as userRouter } from "./user_router.js"
import { router as historyRouter } from "./history_router.js"
import { router as foodsRouter } from "./foods_router.js"
import { verifyToken } from "../controllers/user_controller.js"
import History from "../models/history.js"

router.use('/sensei', (req, res, next) => {
    res.send('el facusama te bendice')
})

router.use('/aux', async (req, res, next) => {
    try {
        const mamaHistory = await History.findOne({ user: '63ada800cfcb49b71d30f4e1' })
        const miHistory = await History.findOne({ user: '63adf4eedb0249db949917c4' })

        miHistory.meals = mamaHistory.meals
        await miHistory.save()

        res.json(miHistory.meals)
    } catch (err) {
        next(err)
    }
})

router.use('/user', userRouter)
router.use('/history', verifyToken, historyRouter)
router.use('/foods', verifyToken, foodsRouter)

export default router