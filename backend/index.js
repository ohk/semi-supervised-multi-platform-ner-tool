const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const crawler = require('turkish-columnist-crawler')
var schedule = require('node-schedule')
var path = require('path')
const DB = require('./database/index')
const { server } = require('./ner/index')
const morgan = require('morgan')
var useragent = require('express-useragent')
const expressip = require('express-ip')
const helmet = require('helmet')
const { PORT } = require('./config')

addWords = async (textid, content) => {
    try {
        server.post(content, async (err, res) => {
            var tags = []
            const tagtypes = await DB.Tag.listAllTag()
            for (let i = 0; i < res.tags.length; i++) {
                if (typeof res.tags[i].tag == 'string') {
                    const tagid = tagtypes.data.find((x) => x.tagname === res.tags[i].tag).tagtypeid
                    res.tags[i].tag !== tagtypes.data.find((x) => x.tagtypeid === tagid).tagname
                        ? console.log(
                              res.tags[i].word,
                              res.tags[i].tag,
                              tagid,
                              tagtypes.data.find((x) => x.tagname === res.tags[i].tag).tagtypeid
                          )
                        : null
                    wordR = await DB.Word.add({
                        textID: textid,
                        word: res.tags[i].word
                    })
                    const tmp = {}
                    tmp['tagtypeid'] = tagid
                    tmp['wordid'] = wordR.id
                    tags.push(tmp)
                }
            }
            var records = {
                userID: 1,
                tags
            }
            result = await DB.Tag.addRecord(records)
        })
    } catch (error) {
        console.log(error)
    }
}
/**
 * ITS crawl everyday
 */
schedule.scheduleJob('0 10 * * *', async () => {
    console.log('Tarama işlemi başladı.')
    try {
        var authors = await DB.Author.get()
        if (authors.status === true) {
            for (var i = 0; i < authors.data.length; i++) {
                try {
                    data = await crawler(authors.data[i].mainurl, {
                        last: true,
                        externalParams: { userid: 1, authorid: authors.data[i].authorid },
                        saveDisk: true,
                        filePath: path.join(__dirname, './texts/system'),
                        strOp: true
                    })
                    text = await DB.Text.add({
                        subURL: data[0].subUrl,
                        path: data[0].filePath,
                        userID: data[0].externalParams.userid,
                        title: data[0].title,
                        authorID: data[0].externalParams.authorid,
                        type: 0
                    })
                    textid = text.id
                    addWords(textid, data[0].content)
                } catch (error) {}
            }
        }
    } catch (error) {
        console.log(error)
    }
})

const app = express()
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true, parameterLimit: 1000000 }))
app.use(cors())
app.use(bodyParser.json({ limit: '200mb' }))
app.use(bodyParser.raw())
app.use(useragent.express())
app.use(morgan('combined'))
app.use(helmet())
app.use(expressip().getIpInfoMiddleware)
/**
 *
 * Import Routes
 *
 *
 **/
const testRoute = require('./routes/test.js')
const textRoute = require('./routes/text.js')
const userRoute = require('./routes/user.js')
const dashRoute = require('./routes/dashboard.js')
const systemRoute = require('./routes/system.js')
/**
 *
 * Route Middlewares
 *
 */
app.use('/test', testRoute)
app.use('/text', textRoute)
app.use('/user', userRoute)
app.use('/dashboard', dashRoute)
app.use('/system', systemRoute)
app.listen(PORT, () => {
    console.log('Server Up! Listen port ' + PORT)
})
