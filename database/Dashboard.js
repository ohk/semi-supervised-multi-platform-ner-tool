const pool = require('./pool')

get = async () => {
    var conneciton = await pool.getPool()
    try {
        data = {}
        try {
            queryUserCount = {
                text: 'SELECT * FROM users WHERE validation = true'
            }
            userCountResult = await conneciton.query(queryUserCount)
            data.userCount = userCountResult.rows.length
        } catch (error) {
            console.log(error)
        }

        try {
            queryUserCount = {
                text: 'SELECT * FROM users ORDER BY textcount DESC LIMIT 10'
            }
            userTop10Result = await conneciton.query(queryUserCount)
            userTop10 = []
            for (let i = 0; i < userTop10Result.rows.length; i++) {
                tmpUserTop10 = {}
                let name = userTop10Result.rows[i].name
                let surname = userTop10Result.rows[i].surname
                let username = userTop10Result.rows[i].username
                let email = userTop10Result.rows[i].email
                let textCount = userTop10Result.rows[i].textcount
                tmpUserTop10.name = name
                tmpUserTop10.surname = surname
                tmpUserTop10.username = username
                tmpUserTop10.email = email
                tmpUserTop10.textCount = textCount
                userTop10.push(tmpUserTop10)
            }
            data.userTop10 = userTop10
        } catch (error) {
            console.log(error)
        }

        try {
            queryUserCount = {
                text: 'SELECT * FROM tag ORDER BY textcount DESC LIMIT 10'
            }
            userTop10Result = await conneciton.query(queryUserCount)
            userTop10 = []
            for (let i = 0; i < userTop10Result.rows.length; i++) {
                tmpUserTop10 = {}
                let name = userTop10Result.rows[i].name
                let surname = userTop10Result.rows[i].surname
                let username = userTop10Result.rows[i].username
                let email = userTop10Result.rows[i].email
                let textCount = userTop10Result.rows[i].textcount
                tmpUserTop10.name = name
                tmpUserTop10.surname = surname
                tmpUserTop10.username = username
                tmpUserTop10.email = email
                tmpUserTop10.textCount = textCount
                userTop10.push(tmpUserTop10)
            }
            data.userTop10 = userTop10
        } catch (error) {
            console.log(error)
        }
        try {
            queryTextCount = {
                text: 'SELECT * FROM text'
            }
            textCountResult = await conneciton.query(queryTextTagCount)
            data.textCount = textCountResult.rows.length
        } catch (error) {
            console.log(error)
        }

        try {
            queryTextTagCount = {
                text: 'SELECT * FROM text WHERE tagcount>1'
            }
            textTagCountResult = await conneciton.query(queryTextTagCount)
            if (textTagCountResult.rows.length != 0) {
                data.process = Math.ceil((textTagCountResult.rows.length / data.textCount) * 100)
            } else {
                data.process = 0
            }
        } catch (error) {
            console.log(error)
        }

        try {
            desktopR = await conneciton.query({
                text: 'SELECT * FROM loginlog WHERE devicetype = 1'
            })
            mobileR = await conneciton.query({
                text: 'SELECT * FROM loginlog WHERE devicetype = 3'
            })
            tabletR = await conneciton.query({
                text: 'SELECT * FROM loginlog WHERE devicetype = 2'
            })
            totalDevice = desktopR.rows.length + mobileR.rows.length + tabletR.rows.length
            desktop = Math.ceil((desktopR.rows.length / totalDevice) * 100)
            mobile = Math.ceil((mobileR.rows.length / totalDevice) * 100)
            tablet = Math.ceil((tabletR.rows.length / totalDevice) * 100)
            data.device = {
                desktop,
                mobile,
                tablet
            }
        } catch (error) {
            console.log(error)
        }

        try {
            textCountR = await conneciton.query({
                text: 'SELECT * FROM text'
            })
            data.textCount = textCountR.rows.length
        } catch (error) {
            console.log(error)
        }

        try {
            textCountR = await conneciton.query({
                text: 'SELECT authorname,category,textcount FROM author'
            })
            data.authors = textCountR.rows
        } catch (error) {
            console.log(error)
        }
        return { status: true, data }
    } catch (error) {
        return { status: false, message: error }
    }
}

module.exports = {
    get
}
