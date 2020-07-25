const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    PG_USER: process.env.PG_USER,
    PG_HOST: process.env.PG_HOST,
    PG_PASSWORD: process.env.PG_PASSWORD,
    PG_DATABASE: process.env.PG_DATABASE,
    PG_PORT: process.env.PG_PORT,
    PG_MAX_CONNECTIONS: process.env.PG_MAX_CONNECTIONS,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_SECURE: process.env.EMAIL_SECURE,
    EMAIL_USERNAME: process.env.EMAIL_USERNAME,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_NAME: process.env.EMAIL_NAME,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    PORT: process.env.PORT,
    PG_IDLE_TIMEOUT_MILLIS: process.env.PG_IDLE_TIMEOUT_MILLIS
}
