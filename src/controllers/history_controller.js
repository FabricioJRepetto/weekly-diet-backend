import History from '../models/history.js'

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
            if (e.date >= start && e.date <= today) {

                if (e.date === today) {
                    !aux.today && (aux.today = [])
                    aux.today.push(e)
                }
                if (e.vegetalC) aux.vegetalC += 1

                switch (new Date(e.date).getDay()) {
                    case 1:
                        !aux.monday && (aux.monday = [])
                        aux.monday.push(e)
                        break;
                    case 2:
                        !aux.tuesday && (aux.tuesday = [])
                        aux.tuesday.push(e)
                        break;
                    case 3:
                        !aux.wednesday && (aux.wednesday = [])
                        aux.wednesday.push(e)
                        break;
                    case 4:
                        !aux.thursday && (aux.thursday = [])
                        aux.thursday.push(e)
                        break;
                    case 5:
                        !aux.friday && (aux.friday = [])
                        aux.friday.push(e)
                        break;
                    case 6:
                        !aux.saturday && (aux.saturday = [])
                        aux.saturday.push(e)
                        break;
                    default:
                        !aux.sunday && (aux.sunday = [])
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

const getHistory = async (req, res, next) => {
    try {
        const id = req.query?.id
        if (!id) return res.json({ error: 'user id no encontrada' })

        const history = await History.findOne({ user: id });

        if (history) return res.json({ history: history.meals })
        else {
            await History.create(
                {
                    user: id,
                    meals: []
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
        const id = req.query?.id
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
        const id = req.query?.id
        if (!id) return res.json({ error: 'user id no encontrada' })

        const history = await History.findOne({ user: id })

        let week = weekAnalist(history, req.query.today, req.query.start)

        if (history) return res.json({ history: history.meals, week })
        else {
            await History.create(
                {
                    user: id,
                    meals: []
                }
            )
            return res.json({ history: [], week })
        }

    } catch (err) {
        next(err)
    }
}

const addMeal = async (req, res, next) => {
    try {
        const id = req.query?.id
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
                    meals: [req.body.meal]
                }
            )

            let week = weekAnalist(history, req.query.today, req.query.start)

            return res.json({ history: newHistory.meals, week })
        }
    } catch (err) {
        next(err)
    }
}

export {
    getHistory,
    getWeek,
    getFullHistory,
    addMeal
}