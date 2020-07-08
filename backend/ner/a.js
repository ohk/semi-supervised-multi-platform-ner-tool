const { Server, Classifier } = require('ner-crf-server')
const DB = require('../database/index')
var path = require('path')

a = async () => {
    modelPath = await DB.Train.getTrainRecordPath()
    console.log(modelPath)
    const server = new Server('localhost', 9005, path.join(__dirname, modelPath.data))
    server.start()
    filename = await DB.Train.createTrainFile()
    const classifiers = new Classifier(`./trainfiles/${filename}.tsv`, `./classifiers/${filename}`)
    classifiers.createProp()
    classifiers.train()
    DB.Train.updateTrainRecord({ id: filename, path: `./classifiers/${filename}.ser.gz` })
    DB.Train.addTrainRecord()
    server.stop()
    modelPath = await DB.Train.getTrainRecordPath()
    returnData = server.setClassifier(modelPath.data)
    console.log(returnData)
    server.start()
}

a()
