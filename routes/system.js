const router = require('express').Router()
const DB = require('../database/index')
const verify = require('../middleware/verify')

router.get('/getUsers', async (req, res) => {})
router.get('/getAuthors', async (req, res) => {})
router.get('/getSettings', async (req, res) => {})
router.get('/getTagTypes', async (req, res) => {})
router.get('/getTrains', async (req, res) => {})
router.get('/getTrainExcludes', async (req, res) => {})

router.post('/addAuthor', async (req, res) => {})
router.post('/deleteAuthor', async (req, res) => {})
router.post('/updateAuthor', async (req, res) => {})

router.post('/addSetting', async (req, res) => {})
router.post('/deleteSetting', async (req, res) => {})
router.post('/updateSetting', async (req, res) => {})

router.post('/addTagType', async (req, res) => {})
router.post('/deleteTagType', async (req, res) => {})
router.post('/updateTagType', async (req, res) => {})

router.post('/deleteTrain', async (req, res) => {})

router.post('/addTrainExcludes', async (req, res) => {})
router.post('/deleteTrainExcludes', async (req, res) => {})
router.post('/updateTrainExcludes', async (req, res) => {})

module.exports = router
