const pool = require('./pool')

get = async () => {
    var conneciton = await pool.getPool()
    try {
        data = {}
        try {
            queryUserCount = {
                text: 'SELECT * FROM users'
            }
            userCountResult = await conneciton.query(queryUserCount)
            data.totalUser = userCountResult.rows.length
        } catch (error) {
            console.log('USER COUNT \n', error)
        }

        try {
            userTop10Query = {
                text: 'SELECT * FROM users WHERE userid != 1 ORDER BY textcount DESC LIMIT 6'
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
            data.top6User = userTop10
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
            data.totalText = textCountResult.rows.length
        } catch (error) {
            console.log('TEXT count \n', error)
        }

        try {
            queryTextTagCount = {
                text: 'SELECT SUM (tagcount) AS total FROM text'
            }
            textTagCountResult = await conneciton.query(queryTextTagCount)
            data.totalTag = textTagCountResult.rows[0].total
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
            devices = {}
            devices.mobileC = mobileR.rows.length
            devices.tabletC = tabletR.rows.length
            devices.desktopC = desktopR.rows.length
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
            devices.mobileV = mobile
            devices.tabletV = tablet
            devices.desktopV = desktop
            data.devices = devices
        } catch (error) {
            console.log('DEvice \n', error)
        }

        try {
            authors = await conneciton.query({
                text: 'SELECT authorname,category,textcount,authorid FROM author ORDER BY textcount DESC LIMIT 6'
            })
            data.top6Author = authors.rows
        } catch (error) {
            console.log('Authors \n', error)
        }

        try {
            authors = await conneciton.query({
                text: 'SELECT COUNT(*) FROM author'
            })
            data.totalAuthor = authors.rows[0].count
        } catch (error) {
            console.log('Authors \n', error)
        }
        try {
            request = await conneciton.query({
                text: 'SELECT SUM (requestcount) AS total FROM users WHERE userid != 1'
            })
            data.totalRequest = request.rows[0].total
        } catch (error) {
            console.log('Authors \n', error)
        }

        try {
            train = await conneciton.query({
                text: 'SELECT COUNT(*) FROM nertrainrecord'
            })
            data.totalTrain = train.rows[0].count - 1
        } catch (error) {
            console.log('Authors \n', error)
        }

        try {
            login = await conneciton.query({
                text:
                    'SELECT logid,ipaddress,l.createdat,country,name,surname,username FROM loginlog l, users u WHERE l.userid = u.userid ORDER BY l.createdat DESC LIMIT 10'
            })
            data.last10login = login.rows
        } catch (error) {
            console.log('Authors \n', error)
        }

        try {
            last10User = await conneciton.query({
                text:
                    'SELECT userid,name,surname,username,email,createdat,validation FROM users  ORDER BY createdat DESC LIMIT 10'
            })
            data.last10User = last10User.rows
        } catch (error) {
            console.log('Authors \n', error)
        }

        try {
            lastTrainCount = await conneciton.query({
                text: "SELECT value FROM setting WHERE key='last_train_count'"
            })
            data.lastTrainCount = lastTrainCount.rows[0].value
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
