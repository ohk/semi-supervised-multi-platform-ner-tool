var pg = require('pg')

const {
    PG_USER,
    PG_HOST,
    PG_DATABASE,
    PG_PASSWORD,
    PG_PORT,
    PG_MAX_CONNECTIONS,
    PG_IDLE_TIMEOUT_MILLIS
} = require('../config')

var pool

var config = {
    user: PG_USER,
    host: PG_HOST,
    database: PG_DATABASE,
    password: PG_PASSWORD,
    port: PG_PORT,
    max: PG_MAX_CONNECTIONS,
    idleTimeoutMillis: PG_IDLE_TIMEOUT_MILLIS
}

module.exports = {
    getPool: function () {
        if (pool) return pool // if it is already there, grab it here
        pool = new pg.Pool(config)
        return pool
    }
}
