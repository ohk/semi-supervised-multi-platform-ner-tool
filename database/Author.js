const pool = require('./pool')

get = async () => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'SELECT * FROM author'
        }
        authors = await conneciton.query(query)
        return { status: true, data: authors.rows }
    } catch (error) {
        return { status: false, data: [] }
    }
}

add = async (data) => {
    try {
        var conneciton = pool.getPool()
        const check = {
            text: 'SELECT * FROM author WHERE mainurl=$1',
            values: [data.mainurl]
        }
        chk = await conneciton.query(check)
        if (chk.rows.length === 0) {
            const query = {
                text: 'INSERT INTO author(authorname,mainurl,category) VALUES($1,$2,$3)',
                values: [data.authorname, data.mainurl, data.category]
            }
            added = await conneciton.query(query)
            if (added.rowCount != 0) {
                return { status: true, message: 'Author successfully added' }
            } else {
                return { status: false, message: 'Query error, please try again' }
            }
        } else {
            return { status: false, message: 'Author is already exist' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

module.exports = {
    get,
    add
}
