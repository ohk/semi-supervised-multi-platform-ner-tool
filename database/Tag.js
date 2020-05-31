const pool = require('./pool')

addRecord = async (data) => {
    try {
        var conneciton = pool.getPool()
        var status = false
        for (let i = 0; i < data.tags.length; i++) {
            try {
                const query = {
                    text: 'INSERT INTO tagrecord(userID,tagTypeID,wordID) VALUES($1, $2, $3)',
                    values: [data.userID, data.tags[i].tagTypeID, data.tags[i].wordID]
                }
                record = await conneciton.query(query)
            } catch (error) {
                status = true
                console.log(error)
            }
        }
        return { status: status, message: 'Record successfully added' }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

addTagType = async (data) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'INSERT INTO tagtype(tagname,color) VALUES($1, $2)',
            values: [data.tagname, data.color]
        }
        type = await conneciton.query(query)
        if (type.rowCount != 0) {
            return { status: true, message: 'Type successfully added' }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

module.exports = {
    addRecord,
    addTagType
}
