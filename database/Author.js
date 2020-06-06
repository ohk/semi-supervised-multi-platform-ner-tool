const pool = require('./pool')

list = async (data) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'SELECT * FROM author ORDER BY authorid ASC LIMIT 15 OFFSET $1',
            values: [data.offset]
        }
        authors = await conneciton.query(query)
        return { status: true, data: authors.rows }
    } catch (error) {
        return { status: false, data: [] }
    }
}

get = async () => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'SELECT * FROM author WHERE crawl = true'
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

block = async (data) => {
    try {
        var conneciton = pool.getPool()
        const blockQ = {
            text: 'UPDATE author SET crawl = false WHERE authorid= ($1)',
            values: [data.authorid]
        }
        block = await conneciton.query(blockQ)
        if (block.rowCount != 0) {
            return { status: true, message: 'Author successfully added' }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

unblock = async (data) => {
    try {
        var conneciton = pool.getPool()
        const blockQ = {
            text: 'UPDATE author SET crawl = true WHERE authorid= ($1)',
            values: [data.authorid]
        }
        block = await conneciton.query(blockQ)
        if (block.rowCount != 0) {
            return { status: true, message: 'Author successfully added' }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

module.exports = {
    list,
    add,
    get,
    block,
    unblock
}
