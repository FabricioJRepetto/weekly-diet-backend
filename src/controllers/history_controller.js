import History from '../models/history.js'
import { group } from '../constants.js'

const weekAnalist = (history, today, start) => {
    let aux = {
        vegetalC: 0,
        today: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
    }

    if (history && history.meals && history.meals.length > 0) {
        //? Separa en días
        history.meals.forEach(e => {
            const eDate = new Date(e.date),
                Start = new Date(start),
                Today = new Date(today)

            if (eDate >= Start && eDate <= Today) {

                if (eDate.getTime() === Today.getTime()) {
                    !aux.today && (aux.today = [])
                    aux.today.push(e)
                }
                if (e.vegetalC) aux.vegetalC += 1

                switch (new Date(eDate).getDay()) {
                    case 1:
                        if (!aux.monday) aux.monday = []
                        aux.monday.push(e)
                        break;
                    case 2:
                        if (!aux.tuesday) aux.tuesday = []
                        aux.tuesday.push(e)
                        break;
                    case 3:
                        if (!aux.wednesday) aux.wednesday = []
                        aux.wednesday.push(e)
                        break;
                    case 4:
                        if (!aux.thursday) aux.thursday = []
                        aux.thursday.push(e)
                        break;
                    case 5:
                        if (!aux.friday) aux.friday = []
                        aux.friday.push(e)
                        break;
                    case 6:
                        if (!aux.saturday) aux.saturday = []
                        aux.saturday.push(e)
                        break;
                    default:
                        if (!aux.sunday) aux.sunday = []
                        aux.sunday.push(e)
                        break;
                }
            }
        })
        //? Checkea balance entre comidas de cada día
        Object.entries(aux).forEach(d => {
            let balanced = true,
                message = [],
                day = d[0]

            if (d[0] !== 'today' && d[1].length > 1) {
                let p1 = {
                    p: !!d[1][0].protein.length,
                    c: !!d[1][0].carbohydrate.length,
                    v: !!d[1][0].vegetal.length
                },
                    p2 = {
                        p: !!d[1][1].protein.length,
                        c: !!d[1][1].carbohydrate.length,
                        v: !!d[1][1].vegetal.length
                    }


                if (!p1.v || !p2.v) { //? si falta vegetal en alguna de las comidas
                    balanced = false
                    message.push('Faltan vegetales')
                }
                if (!p1.p && !p2.p) { //? si falta proteina en ambas comidas
                    balanced = false
                    message.push('Faltan proteinas')
                }
                if (!p1.c && !p2.c) { //? si falta carbos en ambas comidas
                    balanced = false
                    message.push('Faltan carbohidratos')
                }

                if ((p1.p && !p2.p) || (!p1.p && p2.p)) { //? si falta proteina en uno de los platos
                    if (p1.c && p2.c) { //? y ambos platos tienen carbos
                        balanced = false
                        message.push('Faltan proteínas')
                    }
                }
                if ((p1.c && !p2.c) || (!p1.c && p2.c)) { //? si faltan carbos en uno de los platos
                    if (p1.p && p2.p) { //? y ambos platos tienen proteína
                        balanced = false
                        message.push('Faltan carbohidratos')
                    }
                }

                if (!balanced) aux[day].push(message)
            }
        })
    }

    return aux
}

const defineWeek = (d) => {
    if (!d) return {
        today: 'error: no date',
        start: 'error: no date',
        end: 'error: no date'
    }
    // convierto la String a Date
    let date = new Date(d),
        // averiguo el numero del dia (7 si es Domingo)
        day = (date.getDay() === 0) ? 7 : date.getDay(),
        // averiguo el Lunes de esa semana
        firstDay = date.getDate() - (day - 1),
        // everiguo el Domingo de esa semana y convierto a Date
        lastDay = new Date(new Date(d).setDate(firstDay + 6)).toLocaleDateString('en'),
        // innecesario en este caso
        today = date.toLocaleDateString('en'),
        // utilizo el numero del Lunes para generar nuevo Date
        start = new Date(new Date(d).setDate(firstDay)).toLocaleDateString('en'),
        // fecha de Domingo lista, cambio nombre
        end = lastDay;
    //: no creo fecha del Lunes en primera instancia porque necesito el numero para saber la fecha del Domingo

    return {
        today,
        start,
        end
    }
}

const getHistory = async (req, res, next) => {
    try {
        const { id } = req?.user
        if (!id) return res.json({ error: 'user id no encontrada' })

        const history = await History.findOne({ user: id });

        if (history) return res.json({ history: history.meals })
        else {
            await History.create(
                {
                    user: id,
                    meals: [],
                    customFoods: [],
                    checkpoints: []
                }
            )
            return res.json({ history: [] })
        }

    } catch (err) {
        next(err)
    }
}

const getWeek = async (req, res, next) => {
    try {
        const { id } = req?.user
        if (!id) return res.json({ error: 'user id no encontrada' })

        const history = await History.findOne({ user: id })

        let week = weekAnalist(history, req.query.today, req.query.start)

        return res.json({ week })

    } catch (err) {
        next(err)
    }
}

const getFullHistory = async (req, res, next) => {
    try {
        const { id } = req?.user
        if (!id) return res.json({ error: 'user id no encontrada' })

        const history = await History.findOne({ user: id })

        let week = weekAnalist(history, req.query.today, req.query.start)
        let foods = history?.customFoods || []
        let g = { ...group, foods: [...group.foods, ...foods] }

        if (history) return res.json({ history: history.meals, week, group: g })
        else {
            await History.create(
                {
                    user: id,
                    meals: [],
                    customFoods: [],
                    checkpoints: []
                }
            )
            return res.json({ history: [], week, group: g })
        }

    } catch (err) {
        next(err)
    }
}

const addMeal = async (req, res, next) => {
    try {
        const { id } = req?.user
        if (!id) return res.json({ error: 'user id no encontrada' })
        if (!req.body?.meal) return res.json({ error: 'body.meal no encontrada' })

        const history = await History.findOne({ user: id })

        if (history) {
            history.meals.push(req.body.meal)
            await history.save()

            let week = weekAnalist(history, req.query.today, req.query.start)

            return res.json({ history, week })
        } else {
            const newHistory = await History.create(
                {
                    user: id,
                    meals: [req.body.meal],
                    customFoods: [],
                    checkpoints: []
                }
            )

            let week = weekAnalist(history, req.query.today, req.query.start)

            return res.json({ history: newHistory.meals, week })
        }
    } catch (err) {
        next(err)
    }
}

const editMeal = async (req, res, next) => {
    try {
        const { id } = req?.user,
            { meal, meal_id, today, start } = req?.body

        if (!id) return res.json({ error: 'user id not recibed' })
        if (!meal) return res.json({ error: 'meal not recibed' })
        if (!meal_id) return res.json({ error: 'meal_id not recibed' })

        const newMeal = await History.findOneAndUpdate(
            {
                user: id,
                'meals._id': meal_id
            },
            {
                $set: {
                    'meals.$': meal
                }
            },
            { new: true }
        )

        if (newMeal) {
            let week = weekAnalist(newMeal, today, start)
            return res.json({ message: 'Meal updated', history: newMeal, week })
        } else return res.json({ error: true, message: 'Something happend' })
    } catch (err) {
        next(err)
    }
}

const deleteMeal = async (req, res, next) => {
    try {
        const { id } = req?.user,
            { meal_id, today, start } = req?.query

        if (!id) return res.json({ error: 'user id not recibed' })
        if (!meal_id) return res.json({ error: 'meal_id not recibed' })

        const newHistory = await History.findOneAndUpdate(
            {
                user: id
            },
            {
                $pull: {
                    meals: { _id: meal_id }
                }
            },
            { new: true }
        )
        console.log(newHistory);
        const week = weekAnalist(newHistory, today, start)

        return res.json({ message: 'deleted', history: newHistory, week })

    } catch (err) {
        next(err)
    }
}

const getFoods = async (req, res, next) => {
    try {
        const { id } = req?.user
        if (!id) return res.json({ error: 'user id not recibed' })

        const history = await History.findOne({ user: id })

        if (!history.customFoods) return res.json({ foods: [] })

        return res.json({ foods: history.customFoods })

    } catch (err) {
        next(err)
    }
}

const addFood = async (req, res, next) => {
    try {
        const { id } = req?.user,
            { food } = req?.body

        if (!id) return res.json({ error: 'user id not recibed' })
        if (!food) return res.json({ error: 'data (food) not recibed' })

        const history = await History.findOne({ user: id })

        if (history) {
            history.customFoods.push(food)
            await history.save()

            return res.json({ foods: history.customFoods, allFoods: [...group.foods, ...history.customFoods] })
        } else {
            await History.create(
                {
                    user: id,
                    meals: [],
                    customFoods: [food],
                    checkpoints: []
                }
            )

            return res.json({ foods: [food], allFoods: [...group.foods, food] })
        }
    } catch (err) {
        next(err)
    }
}

const editFood = async (req, res, next) => {
    try {
        const { id } = req?.user,
            { food, food_id } = req?.body

        if (!id) return res.json({ error: 'user id not recibed' })
        if (!food) return res.json({ error: 'data (food) not recibed' })
        if (!food_id) return res.json({ error: 'data (food_id) not recibed' })

        const newFood = await History.findOneAndUpdate(
            {
                user: id,
                'customFoods._id': food_id
            },
            {
                $set: {
                    'customFoods.$': food
                }
            },
            { new: true }
        )

        if (newFood) return res.json(
            {
                message: 'Food updated',
                foods: newFood.customFoods,
                allFoods: [...group.foods, newFood.customFoods]
            })
        else return res.json({ error: true, message: 'Something happend' })
    } catch (err) {
        next(err)
    }
}

const deleteFood = async (req, res, next) => {
    try {
        const { id } = req?.user,
            { food_id } = req?.query

        if (!id) return res.json({ error: 'user id not recibed' })
        if (!food_id) return res.json({ error: 'data (food_id) not recibed' })

        const newHistory = await History.findOneAndUpdate(
            {
                user: id
            },
            {
                $pull: {
                    customFoods: { _id: food_id }
                }
            },
            { new: true }
        )

        return res.json({ message: 'deleted', foods: newHistory.customFoods, allFoods: [...group.foods, ...newHistory.customFoods] })

    } catch (err) {
        next(err)
    }
}

const getAllWeeks = async (req, res, next) => {
    try {
        const { id } = req?.user

        if (!id) return res.json({ error: 'user id not recibed' })

        const history = await History.findOne({ user: id })

        if (history && !!history.meals.length) {
            const meals = history.meals,
                checkpoints = history.checkpoints
            let weeks = {},
                response = []

            meals.forEach(e => {
                //? defino semana a la que pertenece la comida
                const { start, end } = defineWeek(e.date),
                    key = `${start}-${end}`
                //? reviso si existe semana en "weeks" o la creo
                //? guardo todas las comidas en la semana correspondiente
                weeks[key]
                    ? weeks[key].push(e)
                    : weeks[key] = [e]
            })
            //? ejecuto "weekAnalist" por cada semana en "weeks"
            let weeksDates = Object.keys(weeks)
            Object.values(weeks).forEach((w, i) => {
                const aux = { meals: w },
                    start = weeksDates[i].split('-')[0],
                    end = weeksDates[i].split('-')[1]

                /*
                let aux = {
                    vegetalC: 0,
                    today: false,
                    monday: false,
                    tuesday: false,
                    wednesday: false,
                    thursday: false,
                    friday: false,
                    saturday: false,
                    sunday: false
                }
                */
                //! agrupar dias

                let analisis = weekAnalist(aux, end, start, true)
                let weekDays = Object.entries(analisis).filter(e => e[0] !== 'vegetalC' && e[0] !== 'today').map(e => e[1])

                // console.log(weekDays);
                let aux1 = {
                    // vegetalC: analisis.vegetalC,
                    // today: analisis.today,
                    ...analisis,
                    dates: {
                        start,
                        end
                    },
                    weekDays
                }

                //? y busco si hay algun control entre las fechas de esta semana
                const checkpointFound = checkpoints.find(c => new Date(c.date) >= new Date(start) && new Date(c.date) <= new Date(end))
                if (checkpointFound) analisis.checkpoint = checkpointFound
                else analisis.checkpoint = checkpointFound

                //? guardo los resultados en "response"
                response.push(aux1)
            });

            //: comparo las fechas de "response" con las fechas de los controles
            //: agrego el control a las semanas correspondientes
            return res.json({ weeks, response })
        }

        return res.json({ error: true, message: 'no history found' })

    } catch (err) {
        next(err)
    }
}

const getCheckpoints = async (req, res, next) => {
    try {
        const { id } = req.user

        if (!id) return res.json({ error: 'user id not recibed' })

        const history = await History.findOne({ user: id })

        if (history) {
            return res.json({ checkpoints: history.checkpoints })
        } else {
            await History.create(
                {
                    user: id,
                    meals: [],
                    customFoods: [],
                    checkpoints: []
                }
            )

            return res.json({ checkpoints: [] })
        }

    } catch (err) {
        next(err)
    }
}

const addCheckpoint = async (req, res, next) => {
    try {
        const { id } = req.user,
            { checkpoint } = req.body

        if (!id) return res.status(400).json({ error: 'user id not recibed' })
        if (!checkpoint) return res.status(400).json({ error: 'data (checkpoint) not recibed' })
        if (!checkpoint.weight) return res.status(400).json({ error: 'data (checkpoint.weight) not recibed' })
        if (!checkpoint.date) return res.status(400).json({ error: 'data (checkpoint.date) not recibed' })

        const history = await History.findOne({ user: id })

        if (history) {
            history.checkpoints.push(checkpoint)
            await history.save()

            return res.json({ checkpoints: history.checkpoints })
        } else {
            await History.create(
                {
                    user: id,
                    meals: [],
                    customFoods: [],
                    checkpoints: [checkpoint]
                }
            )

            return res.json({ checkpoints: [checkpoint] })
        }

    } catch (err) {
        next(err)
    }
}

export {
    getHistory,
    getWeek,
    getFullHistory,
    addMeal,
    editMeal,
    deleteMeal,
    getFoods,
    addFood,
    editFood,
    deleteFood,
    getAllWeeks,
    getCheckpoints,
    addCheckpoint
}