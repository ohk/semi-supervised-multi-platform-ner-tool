const pool = require('./pool')

getLastTrainID = async () => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'SELECT * FROM NERtrainRecord ORDER BY recordid DESC LIMIT 1'
        }
        train = await conneciton.query(query)
        return { status: true, data: train.rows[0].recordid }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

addTrainWordRecord = async (data) => {}

addTrainExcluded = async (data) => {
    try {
        lastTrain = await getLastTrainID()
        var conneciton = pool.getPool()
        const query = {
            text: 'INSERT INTO trainexcluded(trainrecordid,key,value) VALUES($1, $2, $3)',
            values: [lastTrain.data, data.key, data.value]
        }
        train = await conneciton.query(query)
        if (train.rowCount != 0) {
            return { status: true, message: 'Train excluded successfully added' }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error }
    }
}

deleteTrainExcluded = async (data) => {
    try {
        lastTrain = await getLastTrainID()
        var conneciton = pool.getPool()
        const query = {
            text: 'DELETE FROM trainexcluded WHERE trainrecordid = $1 AND key = $2',
            values: [lastTrain.data, data.key]
        }
        train = await conneciton.query(query)
        if (train.rowCount != 0) {
            return { status: true, message: 'Train excluded successfully deleted' }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

updateTrainExcluded = async (data) => {
    try {
        lastTrain = await getLastTrainID()
        var conneciton = pool.getPool()
        const query = {
            text: 'UPDATE trainexcluded SET value = $3 WHERE trainrecordid = $1 AND key = $2',
            values: [lastTrain.data, data.key, data.value]
        }
        train = await conneciton.query(query)
        if (train.rowCount != 0) {
            return { status: true, message: 'Train excluded successfully deleted' }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}
getTrainExcluded = async (data) => {
    try {
        lastTrain = data.id || (await getLastTrainID())
        var conneciton = pool.getPool()
        const query = {
            text: 'SELECT * FROM trainexcluded WHERE trainrecordid = $1',
            values: [lastTrain.data]
        }
        train = await conneciton.query(query)
        return { status: true, data: train.rows }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

getTrainRecord = async () => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'SELECT * FROM NERtrainRecord ORDER BY recordid DESC LIMIT 1'
        }
        train = await conneciton.query(query)
        return { status: true, data: train.rows[0] }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

deleteTrainRecord = async (data) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'DELETE FROM NERtrainRecord WHERE recordid = $1',
            values: [data.recordid]
        }
        train = await conneciton.query(query)
        if (train.rowCount != 0) {
            return { status: true, message: 'Train excluded successfully deleted' }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

addTrainRecord = async (data) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'INSERT INTO nertrainrecord(version) VALUES($1)',
            values: [data.version]
        }
        train = await conneciton.query(query)
        if (train.rowCount != 0) {
            return { status: true, message: 'Train Record successfully added' }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

updateTrainRecord = async (data) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'UPDATE nertrainrecord SET path = $2 WHERE version = $1',
            values: [data.version, data.path]
        }
        train = await conneciton.query(query)
        if (train.rowCount != 0) {
            return { status: true, message: 'Train Record successfully updated' }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

createTrainFile = async (data) => {}

module.exports = {
    getLastTrainID,
    addTrainWordRecord,
    addTrainExcluded,
    deleteTrainExcluded,
    updateTrainExcluded,
    getTrainExcluded,
    getTrainRecord,
    deleteTrainRecord,
    addTrainRecord,
    updateTrainRecord,
    createTrainFile
}
