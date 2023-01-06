import { Router } from "express"
const router = Router()
import {
    getHistory,
    getWeek,
    getFullHistory,
    addMeal,
    editMeal,
    deleteMeal,
    getAllWeeks
} from "../controllers/history_controller.js"

router.get('/', getHistory)
router.get('/fullhistory', getFullHistory)
router.get('/week', getWeek)
router.get('/allweeks', getAllWeeks)
router.post('/', addMeal)
router.put('/', editMeal)
router.delete('/', deleteMeal)

export { router }