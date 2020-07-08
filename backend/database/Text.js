const pool = require('./pool')

add = async (data) => {
    try {
        console.log(data)
        var conneciton = pool.getPool()
        var type = data.type || 0
        var userID = data.userID || 1
        let query
        if (type == 0) {
            query = {
                text: 'INSERT INTO text(subURL,path,title,authorID,userID) VALUES($1, $2, $3, $4, $5) RETURNING textid',
                values: [data.subURL, data.path, data.title, data.authorID, userID]
            }
            await conneciton.query({
                text: 'UPDATE author SET textcount=textcount+1 WHERE authorid=$1',
                values: [data.authorID]
            })
        } else if (type == 1) {
            query = {
                text: 'INSERT INTO text(path,userID,title) VALUES($1, $2, $3) RETURNING textid',
                values: [data.path, userID, data.title]
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

list = async (data) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text:
                'SELECT textid,title,authorname,name,surname,t.tagcount,t.createdat FROM text t,author a, users u WHERE t.authorid = a.authorid AND t.userid = u.userid ORDER BY tagcount ASC,createdat DESC LIMIT $1 OFFSET $2',
            values: [data.rows, data.offset]
        }
        text = await conneciton.query(query)
        const queryC = {
            text: 'SELECT COUNT(*) FROM text'
        }
        count = await conneciton.query(queryC)
        return { status: true, data: text.rows, count: count.rows[0].count }
    } catch (error) {
        return { status: false, data: [], error: error }
    }
}

module.exports = {
    add,
    get,
    list
}
