const router = require('express').Router()
const DB = require('../database/index')
const verify = require('../middleware/verify')

router.get('/getUsers', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            data = {}
            page = parseInt(req.query.page || 0)
            row = parseInt(req.query.row || 15)
            data.row = row
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
            data.offset = page * 15
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

router.get('/getTagTypes', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            result = await DB.Tag.listTagTypes()
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
            result = await DB.Train.getTrainRecord()
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
            result = await DB.Train.getTrainExcluded(req.body)
            res.status(200).send(result)
        } else {
            res.status(401).send('Only for admin')
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.post('/addAuthor', verify, async (req, res) => {
    try {
        isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
        if (isUserAdmin.status === true) {
            result = await DB.Author.add(req.body)
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
            result = await DB.Author.block(req.body)
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
            result = await DB.Author.unblock(req.body)
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

module.exports = router
