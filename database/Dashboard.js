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
            console.log('USER COUNT \n', error)
        }

        try {
            userTop10Query = {
                text: 'SELECT * FROM users ORDER BY textcount DESC LIMIT 10'
            }
            userTop10Result = await conneciton.query(userTop10Query)
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
            console.log('Top 10 \n', error)
        }
        /***
         * BU FONKSIYON DURSUN. BURADA EN ÇOK ETİKETLENE 10 YAZIYI AUTHOR NAME ve USER NAME olarak göster
        try {
            queryUserCount = {
                text: 'SELECT * FROM text ORDER BY textcount DESC LIMIT 10'
            }
            textTop10Result = await conneciton.query(queryUserCount)
            textTop10 = []
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
         */

        try {
            textCountResult = await conneciton.query({
                text: 'SELECT * FROM text'
            })
            data.textCount = textCountResult.rows.length
        } catch (error) {
            console.log('TEXT count \n', error)
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
            console.log('text tag count \n', error)
        }

        try {
            desktopR = await conneciton.query({
                text: 'SELECT * FROM loginlog WHERE device_type = 1'
            })
            mobileR = await conneciton.query({
                text: 'SELECT * FROM loginlog WHERE device_type = 3'
            })
            tabletR = await conneciton.query({
                text: 'SELECT * FROM loginlog WHERE device_type = 2'
            })
            totalDevice = desktopR.rows.length + mobileR.rows.length + tabletR.rows.length
            if (totalDevice > 0) {
                desktop = Math.ceil((desktopR.rows.length / totalDevice) * 100)
                mobile = Math.ceil((mobileR.rows.length / totalDevice) * 100)
                tablet = Math.ceil((tabletR.rows.length / totalDevice) * 100)
            } else {
                desktop = 0
                mobile = 0
                tablet = 0
            }
            data.device = {
                desktop,
                mobile,
                tablet
            }
        } catch (error) {
            console.log('DEvice \n', error)
        }

        try {
            authors = await conneciton.query({
                text: 'SELECT authorname,category,textcount FROM author'
            })
            data.authors = authors.rows
        } catch (error) {
            console.log('Authors \n', error)
        }
        return { status: true, data }
    } catch (error) {
        return { status: false, message: error }
    }
}

module.exports = {
    get
}
