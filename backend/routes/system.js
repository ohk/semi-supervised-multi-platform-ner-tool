const router = require('express').Router()
const DB = require('../database/index')
const verify = require('../middleware/verify')
const crawler = require('turkish-columnist-crawler')
const { server } = require('../ner/index')
const path = require('path')
const serverB = require('../ner/index.js')
router.get('/getUsers', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            data = {}
            page = parseInt(req.query.page || 0)
            row = parseInt(req.query.rows || 15)

            search = '%' + (req.query.search || '') + '%'
            data.search = search

            sortField = req.query.sortField || 'default'
            sortType = req.query.sortType || 'ASC'
            data.sortField = sortField
            data.sortType = sortType

            data.rows = row
            data.offset = page * row
            result = await DB.User.list(data)
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})
router.get('/getAuthors', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            data = {}
            page = parseInt(req.query.page || 0)
            row = parseInt(req.query.rows || 15)

            search = '%' + (req.query.search || '') + '%'
            data.search = search

            sortField = req.query.sortField || 'default'
            sortType = req.query.sortType || 'ASC'
            data.sortField = sortField
            data.sortType = sortType

            data.rows = row
            data.offset = page * row
            result = await DB.Author.list(data)
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})
router.get('/getSettings', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            result = await DB.Settings.list()
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.get('/testSett', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            result = await DB.Settings.update_train_count()
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.get('/getTagTypes', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            data = {}
            page = parseInt(req.query.page || 0)
            row = parseInt(req.query.rows || 15)
            data.rows = row
            data.offset = page * row
            result = await DB.Tag.listTagTypes(data)
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.get('/getTrains', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            data = {}
            page = parseInt(req.query.page || 0)
            row = parseInt(req.query.rows || 15)
            data.rows = row
            data.offset = page * row
            result = await DB.Train.getTrainRecord(data)
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.get('/getTrainExcludes', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            result = await DB.Train.trainExcludedAuthors()
            res.status(200).send({ status: true, data: result })
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

crawlFunc = async (mainurl, authorid) => {
    try {
        data = await crawler(mainurl, {
            limit: -1,
            externalParams: { userid: 1, authorid: authorid },
            saveDisk: true,
            filePath: path.join(__dirname, './texts/system'),
            strOp: true
        })
        for (let i = 0; i < data.length; i++) {
            try {
                text = await DB.Text.add({
                    subURL: data[i].subUrl,
                    path: data[i].filePath,
                    userID: data[i].externalParams.userid,
                    title: data[i].title,
                    authorID: data[i].externalParams.authorid,
                    type: 0
                })
                textid = text.id
                server.post(data[i].content, async (err, res) => {
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
    } catch (error) {
        console.log(error)
    }
}
router.post('/addAuthor', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            result = await DB.Author.add(req.body)
            if (req.body.crawl === true) {
                authorid = result.id
                crawlFunc(req.body.mainurl, authorid)
            }
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})
router.post('/blockAuthor', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            result = await DB.Author.block(req.query.paramid)
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.post('/blockUser', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            result = await DB.User.blockUser(req.query.paramid)
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.post('/makeAdmin', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            result = await DB.User.makeAdmin(req.query.paramid)
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.post('/makeUser', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            result = await DB.User.makeUser(req.query.paramid)
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})
router.post('/unblockAuthor', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            result = await DB.Author.unblock(req.query.paramid)
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.post('/addSetting', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            result = await DB.Settings.add(req.body)
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})
router.post('/deleteSetting', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            result = await DB.Settings.deleteS(req.body)
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})
router.post('/updateSetting', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            result = await DB.Settings.update(req.body)
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})
router.post('/updateTrainFreq', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            result = await DB.Settings.updateM(req.body)
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.post('/addTagType', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            result = await DB.Tag.addTagType(req.body)
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.post('/addTrainExcludes', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            result = await DB.Train.addTrainExcluded(req.body)
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})
router.post('/deleteTrainExcludes', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            result = await DB.Train.deleteTrainExcluded(req.body)
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})
router.post('/updateTrainExcludes', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            result = await DB.Train.updateTrainExcluded(req.body)
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.post('/manuelTrain', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            serverB.train()
            res.status(200).send({ status: true, message: 'Train started ...' })
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ status: false, error: error })
    }
})

router.post('/editTagType', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            console.log(req.body)
            result = await DB.Tag.editTag(req.body)
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ status: false, error: error })
    }
})

module.exports = router
