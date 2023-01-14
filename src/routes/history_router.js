import { Router } from "express"
const router = Router()
import {
    getHistory,
    getWeek,
    // getFullHistory,
    // addMeal,
    addMealV2,
    // editMeal,
    editMealV2,
    // deleteMeal,
    deleteMealV2,
    getAllWeeks,
    getAllWeeksV2,
    getCheckpoints,
    addCheckpoint,
    getFullHistoryV2,

    migrateData,
    migrateData2,
} from "../controllers/history_controller.js"

router.get('/', getHistory)
// router.get('/fullhistory', getFullHistory)
router.get('/fullhistory/V2', getFullHistoryV2)
router.get('/week', getWeek)
router.get('/allweeks', getAllWeeks)
router.get('/allweeks/v2', getAllWeeksV2)

router.get('/checkpoint', getCheckpoints)
router.post('/checkpoint', addCheckpoint)

// router.post('/', addMeal)
router.post('/v2', addMealV2)
// router.put('/', editMeal)
router.put('/v2', editMealV2)
// router.delete('/', deleteMeal)
router.delete('/v2', deleteMealV2)

router.get('/migrate', migrateData)
router.post('/migrate2', migrateData2)

export { router }