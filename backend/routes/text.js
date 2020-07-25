const router = require('express').Router()
const DB = require('../database/index')
const verify = require('../middleware/verify')
const fs = require('fs-extra')
const moment = require('moment')
var path = require('path')
const { server } = require('../ner/index')

const strOps = require('../middleware/stringOps')

router.post('/add', verify, async (req, res) => {
    try {
        let filename = path.join(
            __dirname,
            '../texts/' + req.userid.id + '/' + moment().utc().format('Y-M-D-H:M:S') + '.txt'
        )
        fs.outputFileSync(filename, req.body.content)

        text = await DB.Text.add({
            title: req.body.title,
            path: filename,
            userID: req.userid.id,
            type: 1
        })
        textid = text.id
        textContent = strOps.convertText(req.body.content)
        await server.post(textContent, async (err, resS) => {
            var tags = []
            for (let i = 0; i < resS.tags.length; i++) {
                if (typeof resS.tags[i].tag == 'string') {
                    word = resS.tags[i].word
                    tag = await DB.Tag.getTagTypeID({
                        tagname: resS.tags[i].tag
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
            await DB.Tag.addRecord(records)
            result = await DB.Tag.getTextTag({ textid })
            return res.status(200).send({ status: true, textid: textid })
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/list', async (req, res) => {
    try {
        data = {}
        page = parseInt(req.query.page || 0)
        rows = parseInt(req.query.rows || 15)
        search = '%' + (req.query.search || '') + '%'
        sortField = req.query.sortField || 'tagcount'
        sortType = req.query.sortType || 'ASC'
        data.sortField = sortField
        data.sortType = sortType
        data.offset = page * rows
        data.rows = rows
        data.search = search
        result = await DB.Text.list(data)
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.get('/:textid', verify, async (req, res) => {
    try {
        textid = req.params.textid
        result = await DB.Tag.getTextTag({ textid })
        return res.status(200).send(result)
    } catch (error) {
        return res.status(400).send(error)
    }
})

router.post('/:textid', verify, async (req, res) => {
    try {
        data = {}
        data.textid = req.params.textid
        data.userID = req.userid.id
        data.tags = req.body.tags
        result = await DB.Tag.addRecord(data)
        return res.status(200).send(result)
    } catch (error) {
        return res.status(400).send(error)
    }
})
module.exports = router
