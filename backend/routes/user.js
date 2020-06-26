const router = require('express').Router()
const DB = require('../database/index')
const validate = require('../validation/userV')

var getDevice = function (ua) {
    var $ = { active: false, subactive: false }

    if (/mobile/i.test(ua)) {
        $.active = 'mobile'
        $.Mobile = true
    }

    if (/like Mac OS X/.test(ua)) {
        $.active = 'iOS'
        $.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.')
        if (/like Mac OS X/.test(ua)) {
            $.subactive = 'iPhone'
            $.iPhone = /iPhone/.test(ua)
        }
        if (/like Mac OS X/.test(ua)) {
            $.subactive = 'iPad'
            $.iPad = /iPad/.test(ua)
        }
    }

    if (/Android/.test(ua)) {
        $.active = 'Android'
        $.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[1]
    }

    if (/webOS\//.test(ua)) {
        $.active = 'webOS'
        $.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1]
    }

    if (/(Intel|PPC) Mac OS X/.test(ua)) {
        $.active = 'Safari'
        $.Safari = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true
    }

    if (/Windows NT/.test(ua)) {
        $.active = 'IE'
        $.IE = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1]
    }
    if (/MSIE/.test(ua)) {
        $.active = 'IE'
        $.IE = /MSIE ([0-9]+[\.0-9]*)/.exec(ua)[1]
    }
    if (/Trident/.test(ua)) {
        $.active = 'IE'
        $.IE = /Trident\/.*rv:([0-9]+[\.0-9]*)/.exec(ua)[1]
    }
    if (/Edge\/\d+/.test(ua)) {
        $.active = 'IE Edge'
        $.IE = /Edge\/(\d+)/.exec(ua)[1]
    }

    return $.active + ' ' + $[$.active] + ($.subactive && ' ' + $.subactive + ' ' + $[$.subactive])
}

router.post('/register', async (req, res) => {
    try {
        const { error } = validate.registerValidation(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        var result = await DB.User.register(req.body)
        console.log(result)
        if (result.status === true) {
            return res.status(200).send(result)
        } else {
            return res.status(400).send(result)
        }
    } catch (error) {
        res.status(400).send({ status: false, message: 'Error: ' + error })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { error } = validate.loginValidation(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        data = {}

        if (req.useragent.isMobile === true) {
            data['device_type'] = 3
        } else if (req.useragent.isDesktop === true) {
            data['device_type'] = 1
        } else if (req.useragent.isTablet === true) {
            data['device_type'] = 2
        } else {
            data['device_type'] = 4
        }
        data['loginCredit'] = req.body.loginCredit
        data['password'] = req.body.password
        data['ipaddress'] = req.ipInfo.ip || 'localhost'
        data['os'] = req.useragent.os || 'unknown'
        data['platform'] = req.useragent.platform || 'unknown'
        data['browser'] = req.useragent.browser || 'unknown'
        data['country'] = req.ipInfo.country || 'unknown'
        data['city'] = req.ipInfo.city || 'unknown'

        var result = await DB.User.login(data)
        if (result.status === true) {
            return res.status(200).send(result)
        } else {
            return res.status(400).send(result)
        }
    } catch (error) {
        res.status(400).send('Error: ' + error)
    }
})
router.post('/validate/:validate', async (req, res) => {
    try {
        var result = await DB.User.validate({ key: req.params.validate })
        if (result.status === true) {
            return res.status(200).send({ status: true, message: result.message })
        } else {
            return res.status(400).send({ status: false, message: result.message })
        }
    } catch (error) {
        res.status(400).send({ status: false, error: error })
    }
})

router.post('/validate', async (req, res) => {
    try {
        var result = await DB.User.validate(req.body)
        if (result.status === true) {
            return res.status(200).send(result.message)
        } else {
            return res.status(400).send(result.message)
        }
    } catch (error) {
        res.status(400).send('Error: ' + error)
    }
})

router.post('/reset/:resetcode', async (req, res) => {
    try {
        data = {}
        data.key = req.params.resetcode
        data.password = req.body.password
        var result = await DB.User.reset(data)
        if (result.status === true) {
            return res.status(200).send(result.message)
        } else {
            return res.status(400).send(result.message)
        }
    } catch (error) {
        res.status(400).send('Error: ' + error)
    }
})

router.post('/reset', async (req, res) => {
    try {
        var result = await DB.User.reset(data)
        if (result.status === true) {
            return res.status(200).send(result.message)
        } else {
            return res.status(400).send(result.message)
        }
    } catch (error) {
        res.status(400).send('Error: ' + error)
    }
})
router.post('/forgot', async (req, res) => {
    try {
        var result = await DB.User.forgot(req.body)
        if (result.status === true) {
            return res.status(200).send(result.message)
        } else {
            return res.status(400).send(result.message)
        }
    } catch (error) {
        res.status(400).send('Error: ' + error)
    }
})
module.exports = router
