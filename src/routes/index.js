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
        const allHistories = await History.find({})
        let promises = []

        for (let i = 0; i < allHistories.length; i++) {
            const user = allHistories[i];

            for (let j = 0; j < user.meals.length; j++) {
                const meal = user.meals[j];

                promises.push(History.findOneAndUpdate(
                    {
                        user: user.user,
                        'meals._id': meal._id
                    },
                    {
                        $set: {
                            'meals.$.foods': []
                        }
                    }
                ))
            }
        }

        const promiseAll = await Promise.all(promises);

        res.json(promiseAll)
    } catch (err) {
        next(err)
    }
})

router.use('/user', userRouter)
router.use('/history', verifyToken, historyRouter)
router.use('/foods', verifyToken, foodsRouter)

export default router