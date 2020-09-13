const router = require('express').Router()

router.get('/', verify, async (req, res) => {
    return res.status(200).send('Hello Admin')
})

module.exports = router
