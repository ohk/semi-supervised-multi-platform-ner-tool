const pool = require('./pool')

class Word {
    add = async (data) => {
        try {
            var conneciton = pool.getPool()

            let query = {
                text: 'INSERT INTO word(textid,word) VALUES($1, $2)',
                values: [data.textid, data.word]
            }

            text = await conneciton.query(query)

            if (text.rowCount != 0) {
                return { status: true, message: 'Text successfully added' }
            } else {
                return { status: false, message: 'Query error, please try again' }
            }
        } catch (error) {
            return { status: false, message: error.message }
        }
    }
}

module.exports = {
    Word
}
