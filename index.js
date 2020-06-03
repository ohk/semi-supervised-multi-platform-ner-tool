const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
var cors = require('cors')
const crawler = require('turkish-columnist-crawler')
var schedule = require('node-schedule')
var path = require('path')
const DB = require('../database/index')
const { server } = require('../ner/index')

/**
 * ITS crawl everyday
 */
schedule.scheduleJob('0 10 * * *', async () => {
    try {
        var authors = await DB.Author.get()
        if (authors.status === true) {
            for (var i = 0; i < authors.data.length; i++) {
                data = await crawler(authors.data[i].mainurl, {
                    last: true,
                    externalParams: { userid: 1, authorid: authors.data[i].authorid },
                    saveDisk: true,
                    filePath: path.join(__dirname, '../texts'),
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
                        if (res.tags[i].tag !== undefined && res.tags[i].tag !== null) {
                            word = res.tags[i].word
                            tag = await DB.Tag.getTagTypeID({
                                tagname: res.tags[i].tag
                            })
                            wordR = await DB.Word.add({
                                textID: textid,
                                word
                            })
                            tmp = {}
                            tmp['tagTypeID'] = tag.id
                            tmp['wordID'] = wordR.id
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

/**
 *
 * Import Routes
 *
 *
 **/

const tagRoute = require('./routes/tag.js')
/**
 *
 * Route Middlewares
 *
 */

app.use('/api/tag', tagRoute)

app.listen(process.env.PORT, () => {
    console.log('Server Up! Listen port ' + process.env.PORT)
})
