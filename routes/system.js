const router = require('express').Router()
const DB = require('../database/index')
const verify = require('../middleware/verify')

router.get('/getUsers', async (req, res) => {
    try {
        data = {}
        page = parseInt(req.query.page || 0)
        data.offset = page * 15
        result = await DB.User.list(data)
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})
router.get('/getAuthors', async (req, res) => {
    try {
        data = {}
        page = parseInt(req.query.page || 0)
        data.offset = page * 15
        result = await DB.Author.list(data)
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.get('/getSettings', async (req, res) => {
    try {
        result = await DB.Settings.list()
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.get('/getTagTypes', async (req, res) => {
    try {
        result = await DB.Tag.listTagTypes()
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.get('/getTrains', async (req, res) => {
    try {
        result = await DB.Train.getTrainRecord()
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})
router.get('/getTrainExcludes', async (req, res) => {
    try {
        result = await DB.Train.getTrainExcluded(req.body)
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.post('/addAuthor', async (req, res) => {
    try {
        result = await DB.Author.add(req.body)
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})
router.post('/blockAuthor', async (req, res) => {
    try {
        result = await DB.Author.block(req.body)
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})
router.post('/unblockAuthor', async (req, res) => {
    try {
        result = await DB.Author.unblock(req.body)
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.post('/addSetting', async (req, res) => {
    try {
        result = await DB.Settings.add(req.body)
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})
router.post('/deleteSetting', async (req, res) => {
    try {
        result = await DB.Settings.deleteS(req.body)
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})
router.post('/updateSetting', async (req, res) => {
    try {
        result = await DB.Settings.update(req.body)
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.post('/addTagType', async (req, res) => {
    try {
        result = await DB.Tag.addTagType(req.body)
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.post('/addTrainExcludes', async (req, res) => {
    try {
        result = await DB.Train.addTrainExcluded(req.body)
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})
router.post('/deleteTrainExcludes', async (req, res) => {
    try {
        result = await DB.Train.deleteTrainExcluded(req.body)
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})
router.post('/updateTrainExcludes', async (req, res) => {
    try {
        result = await DB.Train.updateTrainExcluded(req.body)
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

module.exports = router
