const pool = require('./pool')

add = async (data) => {
    try {
        var conneciton = pool.getPool()
        var type = data.type || 0
        var userID = data.userID || 1
        let query
        if (type == 0) {
            query = {
                text: 'INSERT INTO text(subURL,path,title,authorID,userID) VALUES($1, $2, $3, $4, $5) RETURNING textid',
                values: [data.subURL, data.path, data.title, data.authorID, userID]
            }
        } else if (type == 1) {
            query = {
                text: 'INSERT INTO text(subURL,path,userID) VALUES($1, $2, $3)',
                values: [data.subURL, data.path, userID]
            }
        }

        text = await conneciton.query(query)

        if (text.rowCount != 0) {
            return { status: true, message: 'Text successfully added', id: text.rows[0].textid }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

get = async (data) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'SELECT * FROM text WHERE textID = $1',
            values: [data.textID]
        }
        text = await conneciton.query(query)
        return { status: true, data: text.rows }
    } catch (error) {
        return { status: false, data: [] }
    }
}

list = async () => {
    /**
     * TODO : Page yapısı
     */
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'SELECT * FROM text'
        }
        text = await conneciton.query(query)
        return { status: true, data: text.rows }
    } catch (error) {
        return { status: false, data: [] }
    }
}

module.exports = {
    add,
    get,
    list
}
