const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
var cors = require('cors')
const crawler = require('turkish-columnist-crawler')
var schedule = require('node-schedule')
var path = require('path')
const DB = require('./database/index')
const { server } = require('./ner/index')

var useragent = require('express-useragent')
const expressip = require('express-ip')

/**
 * ITS crawl everyday
 */
schedule.scheduleJob('0 10 * * *', async () => {
    try {
        var authors = await DB.Author.get()
        if (authors.status === true) {
            for (var i = 1; i < authors.data.length; i++) {
                data = await crawler(authors.data[i].mainurl, {
                    last: true,
                    externalParams: { userid: 1, authorid: authors.data[i].authorid },
                    saveDisk: true,
                    filePath: path.join(__dirname, '../texts/system'),
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
                server.post(data[0].content, async (err, res) => {
                    var tags = []
                    for (let i = 0; i < res.tags.length; i++) {
                        if (typeof res.tags[i].tag == 'string') {
                            word = res.tags[i].word
                            tag = await DB.Tag.getTagTypeID({
                                tagname: res.tags[i].tag
                            })
                            wordR = await DB.Word.add({
                                textID: textid,
                                word
                            })
                            tmp = {}
                            tmp['tagtypeid'] = tag.id
                            tmp['wordid'] = wordR.id
                            tags.push(tmp)
                        }
                    }
                    var records = {
                        userID: 1,
                        tags
                    }
                    result = await DB.Tag.addRecord(records)
                    console.log(result)
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
})

dotenv.config()

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.raw())
app.use(useragent.express())
app.use(expressip().getIpInfoMiddleware)

/**
 *
 * Import Routes
 *
 *
 **/

const textRoute = require('./routes/text.js')
const userRoute = require('./routes/user.js')
const dashRoute = require('./routes/dashboard.js')
/**
 *
 * Route Middlewares
 *
 */

app.use('/api/text', textRoute)
app.use('/api/user', userRoute)
app.use('/api/dashboard', dashRoute)
app.listen(process.env.PORT, () => {
    console.log('Server Up! Listen port ' + process.env.PORT)
})
