const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// console.log(__dirname)
// console.log(__filename)
// console.log(path.join(__dirname, '../pub'));

const app = express()

// Define pahts for Express config
const pubDirectory = path.join(__dirname, '../pub')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(pubDirectory))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Brian Casey'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Page',
        name: 'Brian Casey'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpMessage: 'This is the help message',
        title: 'Help',
        name: 'Brian Casey'
    })
})

app.get('/weather', (req, res) => {
    const address = req.query.address
    if (!address) {
        return res.send({
            error: "You must provide an address"
        })
    }

    geocode(address, (error, { lat, lon, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(lat, lon, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                address,
                forecast: forecastData,
                location
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Brian Casey',
        error: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Brian Casey',
        error: 'Page not found'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})