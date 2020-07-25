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
            return { status: true, message: 'Setting successfully added' }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
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

updateM = async (data) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: "UPDATE setting SET value = ($1) WHERE key='train_count'",
            values: [data.train_count_value]
        }
        const query2 = {
            text: "UPDATE setting SET value = ($1) WHERE key='train_day'",
            values: [data.train_day_value]
        }
        settings = await conneciton.query(query)
        settings2 = await conneciton.query(query2)
        if (settings.rowCount != 0 && settings2.rowCount != 0) {
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

list = async () => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: "SELECT * FROM setting WHERE key='train_day' OR key='train_count'"
        }
        settings = await conneciton.query(query)
        return { status: true, data: settings.rows }
    } catch (error) {
        return { status: false, data: [] }
    }
}

get_train_count = async () => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: "SELECT value FROM setting WHERE key='last_train_count'"
        }
        settings = await conneciton.query(query)
        return { status: true, data: settings.rows }
    } catch (error) {
        return { status: false, data: [] }
    }
}

update_train_count = async () => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: "UPDATE setting SET value = value + 1 WHERE key='last_train_count' RETURNING value"
        }
        settings = await conneciton.query(query)
        console.log(settings.rows[0].value)
        return { status: true, data: settings.rows[0].value }
    } catch (error) {
        console.log(error)
        return { status: false, data: [] }
    }
}
module.exports = {
    add,
    list,
    update,
    updateM,
    deleteS,
    get_train_count,
    update_train_count
}
