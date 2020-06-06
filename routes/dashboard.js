const router = require('express').Router()
const DB = require('../database/index')
const verify = require('../middleware/verify')

router.get('/', verify, async (req, res) => {
    isUserAdmin = await DB.User.isUserAdmin({ id: req.userid.id })
    if (isUserAdmin.status === true) {
        result = await DB.Dashboard.get()
        if (result.status === true) {
            return res.status(200).send(result.data)
        } else {
            return res.status(400).send(result.message)
        }
    } else {
        return res.status(401).send('This request can only be made by ADMIN.')
    }
})

module.exports = router
