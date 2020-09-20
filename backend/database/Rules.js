const pool = require('./pool')

add = async (data) => {
    try {
        var conneciton = pool.getPool()
        const check = {
            text: 'SELECT * FROM rules WHERE ruletext=$1 AND tagtypeID = $2',
            values: [data.ruletext, data.tagtypeid]
        }
        chk = await conneciton.query(check)
        if (chk.rows.length === 0) {
            const query = {
                text: 'INSERT INTO rules(ruleText, tagtypeID) VALUES ($1, $2)',
                values: [data.ruletext, data.tagtypeid]
            }
            added = await conneciton.query(query)
            if (added.rowCount != 0) {
                return { status: true, message: 'Rule successfully added' }
            } else {
                return { status: false, message: 'Query error, please try again' }
            }
        } else {
            return { status: false, message: 'Rule is already exist' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

remove = async (data) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'DELETE FROM rules WHERE ruleID = $1',
            values: [data.ruleid]
        }
        remove = await conneciton.query(query)
        if (remove.rowCount != 0) {
            return { status: true, message: 'Deleted' }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

list = async (data) => {
    try {
        var conneciton = pool.getPool()
        var list
        switch (data.filter) {
            case true:
                list = {
                    text:
                        'SELECT r.ruleid,r.ruletext,t.tagalias,t.color FROM rules r, tagtype t WHERE t.tagtypeID = r.tagtypeID AND r.tagtypeID =$1  ORDER BY ruleid ASC',
                    values: [data.tagtypeid]
                }
                break
            default:
                list = {
                    text:
                        'SELECT r.ruleid,r.ruletext,t.tagalias,t.color FROM rules r, tagtype t WHERE t.tagtypeID = r.tagtypeID ORDER BY ruleid ASC'
                }
                break
        }
        result = await conneciton.query(list)
        if (result.rows.length !== 0) {
            return { status: true, data: result.rows }
        } else {
            return { status: false, data: [], message: 'Query Error' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

update = async (data) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'UPDATE rules SET ruleText = $1 WHERE ruleID = $2',
            values: [data.ruletext, data.ruleid]
        }
        settings = await conneciton.query(query)
        console.log(settings)
        if (settings.rowCount != 0) {
            return { status: true, message: 'Update Completed' }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

module.exports = {
    add,
    remove,
    list,
    update
}
