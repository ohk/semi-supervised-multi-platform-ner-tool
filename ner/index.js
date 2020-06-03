var path = require('path')
const { Server } = require('ner-crf-server')

const server = new Server('localhost', 9005, path.join(__dirname, './classifiers/model1.ser.gz'))

server.start()

module.exports = {
    server
}
