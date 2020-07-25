var path = require('path')
const { Server, Classifier } = require('ner-crf-server')
const DB = require('../database/index')
var schedule = require('node-schedule')

server = new Server('localhost', 9005, path.join(__dirname, './classifiers/model1.ser.gz'))
server.start()

train = async () => {
    filename = await DB.Train.createTrainFile()
    const classifiers = new Classifier(
        path.join(__dirname, `./trainfiles/${filename}.tsv`),
        path.join(__dirname, `./classifiers/${filename}`)
    )
    classifiers.createProp()
    classifiers.train()
    DB.Train.updateTrainRecord({ id: filename, path: `./classifiers/${filename}.ser.gz` })
    DB.Train.addTrainRecord()
    server.stop()
    modelPath = await DB.Train.getTrainRecordPath()
    returnData = server.setClassifier(modelPath.data)
    server.start()
}
/*schedule.scheduleJob('0 0 * * 0', async () => {
    filename = await DB.Train.createTrainFile()
    const classifiers = new Classifier(
        path.join(__dirname, `./trainfiles/${filename}.tsv`),
        path.join(__dirname, `./classifiers/${filename}`)
    )
    classifiers.createProp()
    classifiers.train()
    DB.Train.updateTrainRecord({ id: filename, path: `./classifiers/${filename}.ser.gz` })
    DB.Train.addTrainRecord()
    server.stop()
    modelPath = await DB.Train.getTrainRecordPath()
    returnData = server.setClassifier(modelPath.data)
    server.start()
})*/

module.exports = {
    server,
    train
}
