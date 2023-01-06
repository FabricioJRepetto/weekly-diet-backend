import { Router } from "express"
const router = Router()
import {
    getFoods,
    addFood,
    editFood,
    deleteFood
} from "../controllers/history_controller.js"

router.get('/', getFoods)
router.post('/', addFood)
router.put('/', editFood)
router.delete('/', deleteFood)

export { router }