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

const dayEmptyCheck = (day, target) => {
    day[target].empty = true

    if (
        day.breakfast.empty &&
        day.lunch.empty &&
        day.afternoonsnack.empty &&
        day.dinner.empty &&
        day.workOut.length < 1
    ) {
        return true
    } else return false
}

//!!!!!!? V2
const weekAnalistV2 = (history, today, start, createWeekDays) => {
    let aux = {
        vegetalC: 0,
        cheatFoods: 0,
        workOuts: 0,
        today: false,
        weekDays: {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
        },
        days: []
    }

    if (history && history.days && history.days.length > 0) {
        const balancer = (e) => {
            let balanced = true,
                message = []

            if (e.lunch && e.dinner) {
                let p1 = {
                    p: !!e.lunch.protein.length,
                    c: !!e.lunch.carbohydrate.length,
                    v: !!e.lunch.vegetal.length
                },
                    p2 = {
                        p: !!e.dinner.protein.length,
                        c: !!e.dinner.carbohydrate.length,
                        v: !!e.dinner.vegetal.length
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

                return {
                    balanced,
                    message
                }

            }
        }

        const extrasCounter = (e) => {
            let vC = 0
            let cF = 0

            e.lunch.vegetalC && (vC += 1)
            e.dinner.vegetalC && (vC += 1)
            e.breakfast.vegetalC && (vC += 1)
            e.afternoonsnack.vegetalC && (vC += 1)


            !!e.lunch.cheatfood.length && (cF += 1)
            !!e.dinner.cheatfood.length && (cF += 1)
            !!e.breakfast.cheatfood.length && (cF += 1)
            !!e.afternoonsnack.cheatfood.length && (cF += 1)

            return {
                vC,
                cF,
                wO: !!e.workOut.length ? 1 : 0
            }
        }

        let newHistory = JSON.stringify(history)
        newHistory = JSON.parse(newHistory)

        //? Separa en días
        newHistory.days.forEach(e => {
            const eDate = new Date(e.date),
                Start = new Date(start),
                Today = new Date(today)


            if (eDate >= Start && eDate <= Today) {

                if (eDate.getTime() === Today.getTime()) {
                    let mealsRegistered = []

                    for (const key in e) {
                        if (Object.hasOwnProperty.call(e, key)) {
                            const meal = e[key];

                            if (typeof e === 'object' && !Array.isArray(e)) {
                                if (meal.hasOwnProperty('empty') && !meal.empty) {
                                    mealsRegistered.push(key)
                                }
                            }

                        }
                    }

                    aux.today = { ...e, mealsRegistered }
                }

                const {
                    vC, // vegetal C
                    cF, // cheat food
                    wO // workout
                } = extrasCounter(e)

                aux.vegetalC = aux.vegetalC + vC
                aux.cheatFoods = aux.cheatFoods + cF
                aux.workOuts = aux.workOuts + wO

                let tempDay = { ...e, ...balancer(e) }
                aux.days.push(tempDay)

                if (createWeekDays) {
                    switch (new Date(eDate).getDay()) {
                        case 1:
                            aux.weekDays.monday = tempDay
                            break;
                        case 2:
                            aux.weekDays.tuesday = tempDay
                            break;
                        case 3:
                            aux.weekDays.wednesday = tempDay
                            break;
                        case 4:
                            aux.weekDays.thursday = tempDay
                            break;
                        case 5:
                            aux.weekDays.friday = tempDay
                            break;
                        case 6:
                            aux.weekDays.saturday = tempDay
                            break;
                        default:
                            aux.weekDays.sunday = tempDay
                            break;
                    }
                }
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
                    days: [],
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

//!!!!!!? V2
const getFullHistoryV2 = async (req, res, next) => {
    try {
        const { id } = req?.user
        if (!id) return res.json({ error: 'user id no encontrada' })

        const history = await History.findOne({ user: id })

        let week = weekAnalistV2(history, req.query.today, req.query.start)
        let foods = history?.customFoods || []
        let g = { ...group, foods: [...group.foods, ...foods] }

        if (history) return res.json({ history: history.days, week, group: g })
        else {
            await History.create(
                {
                    user: id,
                    meals: [],
                    days: [],
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

//!!!!!!? V2
const addMealV2 = async (req, res, next) => {
    try {
        const { id } = req?.user,
            { meal, isExtra } = req?.body

        if (!id) return res.json({ error: 'user id no encontrada' })
        if (!meal) return res.json({ error: 'body.meal no encontrada' })
        if (!meal.mealType) return res.json({ error: 'mealType no encontrada' })

        const history = await History.findOne({ user: id })

        if (history) {
            let day = history.days.find(e => e.date === meal.date)
            if (day) {
                let aux = [...history.days]
                aux = aux.map(day => {
                    if (day.date === meal.date) {
                        if (isExtra) {
                            return {
                                ...day,
                                [meal.mealType]: meal.data,
                                empty: false
                            }
                        }
                        else return {
                            ...day,
                            [meal.mealType]: { ...meal, empty: false },
                            empty: false
                        }
                    } else return day
                })
                history.days = aux
                await history.save()

                let week = weekAnalistV2(history, req.query.today, req.query.start)

                return res.json({ history: history.days, week })
            } else {
                history.days.push(
                    {
                        [meal.mealType]: { ...meal, empty: false },
                        date: meal.date
                    }
                )
                await history.save()

                let week = weekAnalistV2(history, req.query.today, req.query.start)

                return res.json({ history: history.days, week })
            }
        } else {
            let aux = isExtra ? meal.data : { ...meal, empty: false }
            const newHistory = await History.create(
                {
                    user: id,
                    meals: [],
                    days: [
                        {
                            [meal.mealType]: aux,
                            empty: false,
                            date: meal.date
                        }
                    ],
                    customFoods: [],
                    checkpoints: []
                }
            )

            //? modificar
            let week = weekAnalistV2(history, req.query.today, req.query.start)

            return res.json({ history: newHistory.days, week })
        }

    } catch (err) {
        next(err)
    }
}

//!!!!!!? V2
const editMealV2 = async (req, res, next) => {
    try {
        const { id } = req?.user,
            { meal, day_id, today, start } = req?.body

        if (!id) return res.json({ error: 'user id not recibed' })
        if (!meal) return res.json({ error: 'meal not recibed' })
        if (!day_id) return res.json({ error: 'day_id not recibed' })
        if (!meal.mealType) return res.json({ error: 'V2 no compatible, mealType no encontrada' })

        const history = await History.findOne({ user: id })

        if (history) {
            let day = history.days.find(e => e.id === day_id)
            if (day) {
                let aux = [...history.days]
                aux = aux.map(day => {
                    if (day.id === day_id) {
                        return { ...day, [meal.mealType]: { ...meal, empty: false } }
                    } else return day
                })
                history.days = aux
                await history.save()

                let week = weekAnalistV2(history, today, start)

                return res.json({ history: history.days, week })
            } else {
                return res.json({ error: true, message: 'Something happend (no day)' })
            }
        } else return res.json({ error: true, message: 'Something happend (no history)' })

    } catch (err) {
        next(err)
    }
}

//!!!!!!? V2
const deleteMealV2 = async (req, res, next) => {
    try {
        const { id } = req?.user,
            { day_id, mealType, today, start } = req?.query

        if (!id) return res.json({ error: 'user id not recibed' })
        if (!day_id) return res.json({ error: 'day_id not recibed' })
        if (!mealType) return res.json({ error: 'V2 no compatible, mealType not recibed' })

        const history = await History.findOne({ user: id })

        if (history) {
            let day = history.days.find(e => e._id.toString() === day_id)
            if (day) {
                let aux = [...history.days]
                aux = aux.map(day => {
                    if (day.id === day_id) {
                        let empty = dayEmptyCheck(day, mealType)
                        return { ...day, [mealType]: { empty: true }, empty }
                    } else return day
                })
                history.days = aux

                await history.save()

                let week = weekAnalistV2(history, today, start)

                return res.json({ history: history.days, week })
            } else {
                return res.json({ error: true, message: 'Something happend (no day)' })
            }
        } else return res.json({ error: true, message: 'Something happend (no history)' })

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

        let vegC = food.ingredients.find(e => e.vegC),
            aux = { ...food, vegC: !!vegC }

        if (history) {
            history.customFoods.push(aux)
            await history.save()

            return res.json({ foods: history.customFoods, allFoods: [...group.foods, ...history.customFoods] })
        } else {
            await History.create(
                {
                    user: id,
                    meals: [],
                    days: [],
                    customFoods: [aux],
                    checkpoints: []
                }
            )

            return res.json({ foods: [aux], allFoods: [...group.foods, aux] })
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

        let vegC = food.ingredients.find(e => e.vegC),
            aux = { ...food, vegC: !!vegC }

        const newFood = await History.findOneAndUpdate(
            {
                user: id,
                'customFoods._id': food_id
            },
            {
                $set: {
                    'customFoods.$': aux
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

//!!!!!!? V2
const getAllWeeksV2 = async (req, res, next) => {
    try {
        const { id } = req?.user

        if (!id) return res.json({ error: 'user id not recibed' })

        const history = await History.findOne({ user: id })

        if (history && !!history.days.length) {
            const days = history.days,
                checkpoints = history.checkpoints
            let weeks = {},
                response = []

            days.forEach(e => {
                //? defino la semana a la que pertenece la comida
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
                const aux = { days: w },
                    start = weeksDates[i].split('-')[0],
                    end = weeksDates[i].split('-')[1]

                //? agrupo días                                                          
                let analisis = weekAnalistV2(aux, end, start, true) //* true = crear miniDays                

                let aux1 = {
                    ...analisis,
                    dates: {
                        start,
                        end
                    }
                }

                //? y busco si hay algun control entre las fechas de esta semana
                const checkpointFound = checkpoints.find(c => new Date(c.date) >= new Date(start) && new Date(c.date) <= new Date(end))
                aux1.checkpoint = checkpointFound

                //? guardo los resultados en "response"
                response.push(aux1)
            });

            return res.json(response)
        } else {

            return res.json({ error: true, message: 'no history found' })
        }

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
                    days: [],
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

        if (!id) return res.json({ error: 'user id not recibed' })
        if (!checkpoint) return res.json({ error: 'data (checkpoint) not recibed' })
        if (!checkpoint.weight) return res.json({ error: 'data (checkpoint.weight) not recibed' })
        if (!checkpoint.date) return res.json({ error: 'data (checkpoint.date) not recibed' })

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
                    days: [],
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

const migrateData = async (req, res, next) => {
    try {
        const { id } = req?.user

        const data = await History.findOne({ user: id }),
            old = data.meals

        let oldDays = {}
        //? iterar vieja data
        //? guardar comidas con la misma fecha en el mismo obj
        /*            
            {
                fecha: [almuerzo, cena]
            }
        */
        for (let i = 0; i < old.length; i++) {
            const oldMeal = old[i];
            if (oldDays[oldMeal.date]) {
                oldDays[oldMeal.date].push(oldMeal)
            } else {
                oldDays[oldMeal.date] = [oldMeal]
            }
        }

        res.json({ oldDays })

    } catch (err) {
        next(err)
    }
}
const migrateData2 = async (req, res, next) => {
    try {
        const { old } = req.body

        if (!old) return res.json({ error: 'no data' })

        let newDays = []

        //? itero el nuevo array
        //? le doy formato a la info
        // almuerzo = data[0], cena = data[1]
        // si hay almuerzo agrego, si hay cena agrego
        //? guardo en array

        for (let i = 0; i < Object.values(old).length; i++) {
            const data = Object.values(old)[i],
                date = Object.keys(old)[i]
            // console.log(date, data);
            let newData = { date }

            data[0] && (newData.lunch = { ...data[0], empty: false })
            data[1] && (newData.dinner = { ...data[1], empty: false })

            newDays.push(newData)
        }

        //: guardar cada dia de newDays en la db

        const history = await History.findOne({ user: req.user.id })

        history.days = newDays
        await history.save()

        // for (let i = 0; i < newDays.length; i++) {
        //     const day = newDays[i];

        // }

        return res.json({ newData: newDays, days: history.days })

    } catch (err) {
        next(err)
    }
}

export {
    getHistory,
    getWeek,

    getFullHistoryV2,
    addMealV2,
    editMealV2,
    deleteMealV2,

    getFoods,
    addFood,
    editFood,
    deleteFood,

    getAllWeeksV2,
    getCheckpoints,
    addCheckpoint,

    migrateData,
    migrateData2
}