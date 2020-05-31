const pool = require('./pool')

add = async (data) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'INSERT INTO setting(key,value) VALUES($1, $2)',
            values: [data.key, data.value]
        }
        settings = await conneciton.query(query)
        if (settings.rowCount != 0) {
            return { status: true, message: 'Type successfully added' }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

get = async () => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'SELECT * FROM setting'
        }
        settings = await conneciton.query(query)
        return { status: true, data: settings.rows }
    } catch (error) {
        return { status: false, data: [] }
    }
}

update = async (data) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'UPDATE setting SET value = ($1) WHERE key= ($2)',
            values: [data.value, data.key]
        }
        settings = await conneciton.query(query)
        if (settings.rowCount != 0) {
            return { status: true, message: 'Update Completed' }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

deleteS = async (data) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'DELETE FROM setting WHERE key=($1)',
            values: [data.key]
        }
        settings = await conneciton.query(query)
        if (settings.rowCount != 0) {
            return { status: true, message: 'Deleted' }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}
module.exports = {
    add,
    get,
    update,
    deleteS
}
