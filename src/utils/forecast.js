const request = require('request')

const forecast = (lat, lon, callback) => {
    const url = `https://api.darksky.net/forecast/c5ea4e4b953676be49b1fa21e7b00bd7/${lat},${lon}`

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to contact weather service', undefined)
        } else if (body.error) {
            callback('Unable to find location', undefined)
        } else {
            const currently = body.currently
            const forecast = `${body.daily.data[0].summary} It is currently ${currently.temperature} degrees out. There is a ${currently.precipProbability}% chance of rain`
            callback(undefined, forecast)
        }
    })
}

module.exports = forecast