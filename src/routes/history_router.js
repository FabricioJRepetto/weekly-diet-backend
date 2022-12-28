import { Router } from "express"
const router = Router()
import {
    getHistory,
    getWeek,
    getFullHistory,
    addMeal
} from "../controllers/history_controller.js"

router.get('/', getHistory)
router.get('/fullhistory', getFullHistory)
router.get('/week', getWeek)
router.post('/', addMeal)

export { router }