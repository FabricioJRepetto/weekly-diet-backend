const carbo = [{
    list: 'carbohydrate',
    color: '#7f6341',
    name: 'Fideos integrales'
},
{
    list: 'carbohydrate',
    color: '#ffe7ab',
    name: 'Rabioles'
},
{
    list: 'carbohydrate',
    color: '#f6ead3',
    name: 'Arroz integral'
},
{
    list: 'carbohydrate',
    color: '#f4d392',
    name: 'Garbanzos'
},
{
    list: 'carbohydrate',
    color: '#78b854',
    name: 'Arvejas'
},
{
    list: 'carbohydrate',
    color: '#f4e88d',
    name: 'Porotos'
},
{
    list: 'carbohydrate',
    color: '#8c5f47',
    name: 'Lentejas'
},
{
    list: 'carbohydrate',
    color: '#f6ead3',
    name: 'Quinoa'
},
{
    list: 'carbohydrate',
    color: '#ffd271',
    name: 'Pizza'
},
{
    list: 'carbohydrate',
    color: '#f6dfa2',
    name: 'Empanadas'
},
{
    list: 'carbohydrate',
    color: '#ffe59c',
    name: 'Tarta'
},
{
    list: 'carbohydrate',
    color: '#deb954',
    name: 'Milanesa de soja'
},
{
    list: 'carbohydrate',
    color: '#FFFFFF',
    name: 'Masas en gral.'
}],
    vegA = [{
        list: 'vegetal',
        color: '#4d7c37',
        group: 'A',
        name: 'Acelga'
    },
    {
        list: 'vegetal',
        color: '#4d7c37',
        group: 'A',
        name: 'Achicoria'
    },
    {
        list: 'vegetal',
        color: '#dd2e2e',
        group: 'A',
        name: 'Ají'
    },
    {
        list: 'vegetal',
        color: '#94d662',
        group: 'A',
        name: 'Apio'
    },
    {
        list: 'vegetal',
        color: '#67297e',
        group: 'A',
        name: 'Berenjena'
    },
    {
        list: 'vegetal',
        color: '#5fab45',
        group: 'A',
        name: 'Berro'
    },
    {
        list: 'vegetal',
        color: '#4d7c37',
        group: 'A',
        name: 'Brócoli'
    },
    {
        list: 'vegetal',
        color: '#FFFFFF',
        group: 'A',
        name: 'Coliflor'
    },
    {
        list: 'vegetal',
        color: '#4d7c37',
        group: 'A',
        name: 'Espinaca'
    },
    {
        list: 'vegetal',
        color: '#4d7c37',
        group: 'A',
        name: 'Rúcula'
    },
    {
        list: 'vegetal',
        color: '#4d7c37',
        group: 'A',
        name: 'Esparrago'
    },
    {
        list: 'vegetal',
        color: '#FFFFFF',
        group: 'A',
        name: 'Hinojo'
    },
    {
        list: 'vegetal',
        color: '#ccbaa9',
        group: 'A',
        name: 'Hongos'
    },
    {
        list: 'vegetal',
        color: '#5fab45',
        group: 'A',
        name: 'Lechuga'
    },
    {
        list: 'vegetal',
        color: '#1e481e',
        group: 'A',
        name: 'Pepino'
    },
    {
        list: 'vegetal',
        color: '#9e2f65',
        group: 'A',
        name: 'Rabanito'
    },
    {
        list: 'vegetal',
        color: '#4d7c37',
        group: 'A',
        name: 'Radicheta'
    },
    {
        list: 'vegetal',
        color: '#882b4d',
        group: 'A',
        name: 'Repollo'
    },
    {
        list: 'vegetal',
        color: '#4d7c37',
        group: 'A',
        name: 'Repollito de brucelas'
    },
    {
        list: 'vegetal',
        color: '#dd2e2e',
        group: 'A',
        name: 'Tomate'
    },
    {
        list: 'vegetal',
        color: '#317137',
        group: 'A',
        name: 'Zapallito'
    },
    {
        list: 'vegetal',
        color: '#317137',
        group: 'A',
        name: 'Zucchini'
    }],
    vegB = [{
        list: 'vegetal',
        color: '#2f883a',
        group: 'B',
        name: 'Alcaucil'
    },
    {
        list: 'vegetal',
        color: '#FFFFFF',
        group: 'B',
        name: 'Cebolla'
    },
    {
        list: 'vegetal',
        color: '#ceffcb',
        group: 'B',
        name: 'Cebolla de verdeo'
    },
    {
        list: 'vegetal',
        color: '#FFFFFF',
        group: 'B',
        name: 'Brotes de soja'
    },
    {
        list: 'vegetal',
        color: '#2f883a',
        group: 'B',
        name: 'Chauchas'
    },
    {
        list: 'vegetal',
        color: '#5fb66a',
        group: 'B',
        name: 'Habas'
    },
    {
        list: 'vegetal',
        color: '#2f883a',
        group: 'B',
        name: 'Puerro'
    },
    {
        list: 'vegetal',
        color: '#5e223e',
        group: 'B',
        name: 'Remolacha'
    },
    {
        list: 'vegetal',
        color: '#df5200',
        group: 'B',
        name: 'Zanahoria'
    },
    {
        list: 'vegetal',
        color: '#df5200',
        group: 'B',
        name: 'Puré de zapallo'
    },
    {
        list: 'vegetal',
        color: '#df5200',
        group: 'B',
        name: 'Zapallo'
    }],
    vegC = [{
        list: 'carbohydrate',
        color: '#c8982a',
        vegC: true,
        name: 'Papa'
    },
    {
        list: 'carbohydrate',
        color: '#6f5312',
        vegC: true,
        name: 'Puré de papa'
    },
    {
        list: 'carbohydrate',
        color: '#6f5312',
        vegC: true,
        name: 'Batata'
    },
    {
        list: 'carbohydrate',
        color: '#6f5312',
        vegC: true,
        name: 'Puré de batata'
    },
    {
        list: 'carbohydrate',
        color: '#f0cc00',
        vegC: true,
        name: 'Choclo'
    },
    {
        list: 'carbohydrate',
        color: '#5e3c1a',
        vegC: true,
        name: 'Mandioca'
    }],
    red_meat = [{
        list: 'protein',
        color: '#9b6d6d',
        name: 'Bife'
    },
    {
        list: 'protein',
        color: '#9b6d6d',
        name: 'Churrasco'
    },
    {
        list: 'protein',
        color: '#9b6d6d',
        name: 'Milanesa al horno'
    },
    {
        list: 'protein',
        color: '#9b6d6d',
        name: 'Carne a la plancha'
    },
    {
        list: 'protein',
        color: '#9b6d6d',
        name: 'Carne al horno'
    },
    {
        list: 'protein',
        color: '#9b6d6d',
        name: 'Carne a la parrilla'
    }],
    chicken = [{
        list: 'protein',
        color: '#f1d490',
        name: 'Pollo a la plancha'
    },
    {
        list: 'protein',
        color: '#f1d490',
        name: 'Milanesa de pollo'
    },
    {
        list: 'protein',
        color: '#f1d490',
        name: 'Pollo al horno'
    },
    {
        list: 'protein',
        color: '#f1d490',
        name: 'Pollo la parrilla'
    }],
    fish = [{
        list: 'protein',
        color: '#bbc8ca',
        name: 'Pescado a la plancha'
    },
    {
        list: 'protein',
        color: '#bbc8ca',
        name: 'Pescado empanado al horno'
    }],
    pig = [{
        list: 'protein',
        color: '#f6c9c9',
        name: 'Pechito de cerdo'
    },
    {
        list: 'protein',
        color: '#f6c9c9',
        name: 'Costillita de cerdo'
    },
    {
        list: 'protein',
        color: '#f6c9c9',
        name: 'Milanesa de cerdo'
    }],
    egg = [{
        list: 'protein',
        color: '#FFFFFF',
        name: 'Huevo'
    }],
    protein = red_meat.concat(chicken, fish, pig, egg),
    vegetal = vegA.concat(vegB),
    carbohydrate = carbo.concat(vegC),
    foods = [
        {
            name: 'Tortilla de papas',
            mix: true,
            list: 'foods',
            lists: ['protein', 'carbohydrate']
        },
        {
            name: 'Omelette con verduras',
            mix: true,
            list: 'foods',
            lists: ['protein', 'vegetal']
        },
        {
            name: 'Hamburguesa',
            mix: true,
            list: 'foods',
            lists: ['carbohydrate', 'protein']
        },
        {
            name: 'Lasagna de zucchini',
            mix: true,
            list: 'foods',
            lists: ['vegetal']
        },
        {
            name: 'Zapallitos rellenos',
            mix: true,
            list: 'foods',
            lists: ['vegetal', 'protein']
        },
    ],
    everything = protein.concat(carbohydrate, vegetal)

export const group = {
    protein,
    carbohydrate,
    vegetal,
    red_meat,
    chicken,
    fish,
    pig,
    egg,
    vegA,
    vegB,
    vegC,
    foods,
    everything
}