var pg = require('pg')

const dotenv = require('dotenv')

var pool
dotenv.config({ path: '../' })

var config = {
    user: process.env.PGUSER || 'postgres',
    host: process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'ytu-ner',
    password: process.env.PGPASSWORD || '230905',
    port: process.env.PGPORT || '5432',
    max: process.env.PGMAXCONNECTIONS || 20,
    idleTimeoutMillis: 30000
}

module.exports = {
    getPool: function () {
        if (pool) return pool // if it is already there, grab it here
        pool = new pg.Pool(config)
        return pool
    }
}
