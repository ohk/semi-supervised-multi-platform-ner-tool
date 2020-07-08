const express = require('express')
const dotenv = require('dotenv')
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

main = async () => {
    try {
        var authors = await DB.Author.get()
        if (authors.status === true) {
            console.log(authors)
            for (var i = 0; i < authors.data.length; i++) {
                try {
                    console.log(`Tarama ${i + 1}/${authors.data.length} tamamlandı.`)
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
                        console.log(err, res)
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
                    })
                } catch (error) {
                    console.log(error)
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

main()
