import { Router } from "express"
const router = Router()
import {
    getHistory,
    getWeek,
    getFullHistory,
    addMeal,
    editMeal,
    deleteMeal,
    getAllWeeks,
    getCheckpoints,
    addCheckpoint
} from "../controllers/history_controller.js"

router.get('/', getHistory)
router.get('/fullhistory', getFullHistory)
router.get('/week', getWeek)
router.get('/allweeks', getAllWeeks)
router.get('/checkpoint', getCheckpoints)

router.post('/', addMeal)
router.post('/checkpoint', addCheckpoint)

router.put('/', editMeal)

router.delete('/', deleteMeal)

export { router }