const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    const token = req.header('token')
    if (!token) return res.status(401).send('Access denied!')

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET || 'jhfasjkbhfjkashfjkajhj')
        req.userid = verified
        req.userID = verified
        next()
    } catch (err) {
        res.status(400).send('Invalid Token')
    }
}
