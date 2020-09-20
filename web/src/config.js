const dotenv = require('dotenv')
dotenv.config()

module.exports = global.config = {
    API_ENDPOINT: process.env.API_ENDPOINT,
    GOOGLE_RECAPTCHA_KEY: process.env.GOOGLE_RECAPTCHA_KEY
}
