const pool = require('./pool')
const fs = require('fs')
var path = require('path')
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
        var conneciton = pool.getPool()
        lastTrain = await getLastTrainID()
        if (data.key === 'BEGIN') {
            return await updateTrainExcluded({ key: data.key, value: '1970-01-01 11:17:15.409152+03' })
        } else {
            const query = {
                text: 'DELETE FROM trainexcluded WHERE trainrecordid = $1 AND key = $2 AND value = $3',
                values: [lastTrain.data, data.key, data.value]
            }
            train = await conneciton.query(query)
            if (train.rowCount != 0) {
                return { status: true, message: 'Train excluded successfully deleted' }
            } else {
                return { status: false, message: 'Query error, please try again' }
            }
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
            return { status: true, message: 'Train excluded successfully updated' }
        } else {
            return { status: false, message: 'Query error, please try again' }
        }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

getTrainExcluded = async (data) => {
    try {
        a = await getLastTrainID()
        trainid = data.id || a.data
        var conneciton = pool.getPool()
        const query = {
            text: 'SELECT * FROM trainexcluded WHERE trainrecordid = $1',
            values: [trainid]
        }
        train = await conneciton.query(query)
        return { status: true, data: train.rows }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

getTrainRecord = async (data) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'SELECT * FROM NERtrainRecord ORDER BY recordid DESC LIMIT $1 OFFSET $2',
            values: [data.rows, data.offset]
        }
        const queryC = {
            text: 'SELECT COUNT(*) FROM NERtrainRecord'
        }
        count = await conneciton.query(queryC)
        train = await conneciton.query(query)
        return { status: true, data: train.rows, count: count.rows[0].count }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

getTrainRecordPath = async () => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'SELECT * FROM NERtrainRecord ORDER BY recordid DESC LIMIT 2'
        }
        train = await conneciton.query(query)
        return { status: true, data: train.rows[1].path }
    } catch (error) {
        return { status: false, data: './classifiers/model1.ser.gz' }
    }
}

addTrainRecord = async () => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'INSERT INTO nertrainrecord(path) VALUES($1)',
            values: ['']
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
            text: 'UPDATE nertrainrecord SET path = $2 WHERE recordid = $1',
            values: [data.id, data.path]
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

getTrainExcludedAuthors = async (trainid) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'SELECT value FROM trainexcluded WHERE trainrecordid = $1 AND key=$2',
            values: [trainid, 'author']
        }
        train = await conneciton.query(query)
        return { status: true, data: train.rows }
    } catch (error) {
        return { status: false, message: error.message }
    }
}

authorList = async () => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'SELECT * FROM author ORDER BY authorid ASC'
        }
        authors = await conneciton.query(query)
        return { status: true, data: authors.rows }
    } catch (error) {
        return { status: false, data: [] }
    }
}

trainExcludedAuthors = async () => {
    var ids = []
    trainid = await getLastTrainID()
    excludedAuthors = await getTrainExcludedAuthors(trainid.data)
    authors = await authorList()
    for (let i = 0; i < authors.data.length; i++) {
        var block = false
        for (let t = 0; t < excludedAuthors.data.length; t++) {
            if (authors.data[i].authorid.toString() === excludedAuthors.data[t].value.toString()) {
                block = true
            }
        }
        if (block === false) {
            tmp = {}
            tmp['authorid'] = authors.data[i].authorid
            tmp['authorname'] = authors.data[i].authorname
            tmp['textcount'] = authors.data[i].textcount
            tmp['block'] = false
            ids.push(tmp)
        } else {
            tmp = {}
            tmp['authorid'] = authors.data[i].authorid
            tmp['authorname'] = authors.data[i].authorname
            tmp['textcount'] = authors.data[i].textcount
            tmp['block'] = true
            ids.push(tmp)
        }
    }
    return ids
}
createTrainFile = async () => {
    var conneciton = pool.getPool()
    var ids = []
    trainid = await getLastTrainID()
    excludedAuthors = await getTrainExcludedAuthors(trainid.data)
    authors = await authorList()
    for (let i = 0; i < authors.data.length; i++) {
        var block = false
        for (let t = 0; t < excludedAuthors.data.length; t++) {
            if (authors.data[i].authorid.toString() === excludedAuthors.data[t].value.toString()) {
                block = true
            }
        }
        if (block === false) {
            ids.push(authors.data[i].authorid)
        }
    }
    for (let id = 0; id < ids.length; id++) {
        authorid = ids[id]
        const query = {
            text: `SELECT t.word,t.tagname FROM(SELECT DISTINCT ON (words.wordid) words.wordid, words.word, tt.tagtypeid, tt.tagname, words.createdat
            FROM word words, (
                SELECT t.textID 
                FROM trainExcluded te, author a, text t 
                WHERE te.trainRecordID = $1 AND 
                    t.authorID = $2
                    AND 
                    (te.key = 'BEGIN' AND t.createdat >= CAST(te.value AS timestamp with time zone))
                
            ) texts, tagcount tc, tagtype tt 
            WHERE texts.textID = words.textID AND tc.wordid = words.wordid 
            AND tc.count = (SELECT MAX(count) FROM tagcount WHERE wordid = words.wordid) AND tt.tagtypeid = tc.tagtypeid) t ORDER BY t.createdat`,
            values: [trainid.data, authorid]
        }
        result = await conneciton.query(query)
        dir = '../ner/trainfiles/'
        if (!fs.existsSync(path.join(__dirname, dir))) {
            fs.mkdirSync(dir)
        }
        for (let row = 0; row < result.rows.length; row++) {
            const element = result.rows[row]
            fs.appendFileSync(
                path.join(__dirname, `../ner/trainfiles/${trainid.data}.tsv`),
                `${element.word}\t${element.tagname}\n`
            )
        }
    }
    console.log('Train File Oluşturuldu.')
    return trainid.data
}

module.exports = {
    getLastTrainID,
    addTrainExcluded,
    deleteTrainExcluded,
    updateTrainExcluded,
    getTrainExcluded,
    getTrainRecord,
    addTrainRecord,
    updateTrainRecord,
    createTrainFile,
    getTrainExcludedAuthors,
    trainExcludedAuthors,
    authorList,
    getTrainRecordPath
}
