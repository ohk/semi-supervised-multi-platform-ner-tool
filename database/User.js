const pool = require('./pool')
const Email = require('../middleware/emailSender')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')

/**
 * TODO: Email implementation
 * TODO: Validate Account
 * TODO: Login if not valid send validation mail
 */

log = async (data) => {
    var conneciton = await pool.getPool()
    const saveQuery = {
        text: 'INSERT INTO loginlog(device ,ipaddress ,location ,userID) VALUES($1,$2,$3,$4)',
        values: [data.device, data.ipaddress, data.location, data.userID]
    }
    saveLog = await conneciton.query(saveQuery)
    if (saveLog.rowCount === 1) {
        return { success: true, message: 'Log is created' }
    }
}

/**
 * object fields:
 * username
 * password
 * email address
 * name
 * surname
 */
register = async (data) => {
    try {
        var conneciton = await pool.getPool()

        /**
         * Check username is already exist?
         */
        const usernameQuery = {
            text: 'SELECT * FROM users WHERE username = $1',
            values: [data.username]
        }
        usernameCheck = await conneciton.query(usernameQuery)
        if (usernameCheck.rows.length != 0) {
            return { status: false, message: 'This username is already exist' }
        }

        /**
         * Check email is already exist?
         */
        const emailQuery = {
            text: 'SELECT * FROM users WHERE email = $1',
            values: [data.email]
        }
        emailCheck = await conneciton.query(emailQuery)
        if (emailCheck.rows.length != 0) {
            return { status: false, message: 'This email is already exist' }
        }

        /**
         * If username or email address is not exists, create a new user.
         * Hash the password
         */
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(data.password.toString(), salt)

        const saveQuery = {
            text: 'INSERT INTO users(name ,surname ,username ,password ,email) VALUES($1,$2,$3,$4,$5)',
            values: [data.name, data.surname, data.username, hashedPassword, data.email]
        }

        saveUser = await conneciton.query(saveQuery)

        /**
         * Create validation key for user is a real person?
         */
        const idQuery = {
            text: 'SELECT * FROM users WHERE email = $1',
            values: [data.email]
        }
        idQ = await conneciton.query(idQuery)
        userID = idQ.rows[0].userid
        validationKey = jwt.sign({ id: userID }, process.env.TOKEN_SECRET || 'jhfasjkbhfjkashfjkajhj')

        //await Email.verificationMail(data.email, validationKey)

        if (saveUser.rowCount === 1) {
            return { status: true, message: 'User is statusfully registered' }
        }
    } catch (error) {
        console.log(error)
        return { status: false, message: error.message }
    }
}

login = async (data) => {
    var conneciton = await pool.getPool()
    const query = {
        text: 'SELECT * FROM users WHERE (username = $1 ) OR (email = $1)',
        values: [data.loginCredit]
    }

    check = await conneciton.query(query)
    if (check.rows.length != 0) {
        const validPassword = await bcrypt.compare(data.password.toString(), check.rows[0].password)
        if (!validPassword) {
            return { status: false, message: 'Login credentials are incorrect' }
        } else {
            userID = check.rows[0].userid
            data['userID'] = userID
            await log(data)
            /**
             * TODO AUTH CODE RETURN
             */
            return { status: true, user_id: userID, message: 'Login credentials are correct' }
        }
    } else {
        return { status: false, message: 'Login credentials are incorrect' }
    }
}

forgot = async (data) => {
    var conneciton = await pool.getPool()

    const query = {
        text: 'SELECT * FROM users WHERE username = $1 OR email = $1',
        values: [data.loginCredit]
    }

    check = await conneciton.query(query)
    if (check.rows.length != 0) {
        userID = check.rows[0].userid
        const isExist = {
            text: 'SELECT * FROM forgotpassword WHERE userid = $1 AND status = 0',
            values: [userID]
        }
        if (isExist.rows.length == 0) {
            hashedKey = jwt.sign({ id: userID }, process.env.TOKEN_SECRET || 'jhfasjkbhfjkashfjkajhj')
            const createHashQuery = {
                text: 'INSERT INTO forgotpassword(hashedkey, userid) VALUES($1,$2)',
                values: [hashedKey, userID]
            }
            /**
             * TODO: KEY GERİ DÖNDÜRME
             */
            createHash = await conneciton.query(createHashQuery)
            return { status: true, key: hashedKey, message: 'Data confirmed' }
        } else {
            return { status: true, key: isExist.rows[0].hashedKey, message: 'Data confirmed' }
        }
    } else {
        return { status: false, message: 'Login credentials are incorrect' }
    }
}

reset = async (data) => {
    try {
        var conneciton = await pool.getPool()
        const query = {
            text: 'SELECT * FROM forgotpassword WHERE hashedkey = $1 AND status = 1',
            values: [data.key]
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(data.password.toString(), salt)

        check = await conneciton.query(query)
        if (check.rows.length != 0) {
            const verified = jwt.verify(data.key, process.env.TOKEN_SECRET || 'jhfasjkbhfjkashfjkajhj')
            const updateQuery = {
                text: 'UPDATE users SET password = $1 WHERE userid = $2',
                values: [hashedPassword, verified.id]
            }
            updatePass = await conneciton.query(updateQuery)
            if (updatePass.rowCount == 1) {
                const resetTheCode = {
                    text: 'UPDATE forgotpassword SET status = 0 WHERE hashedkey = $1',
                    values: [data.key]
                }
                await conneciton.query(resetTheCode)
                return { status: true, message: 'Password is successfully updated' }
            } else {
                return { status: false, message: 'Password update failed' }
            }
        } else {
            return { status: false, message: 'Key is not valid' }
        }
    } catch (error) {
        return { status: false, message: error }
    }
}

validate = (data) => {}

module.exports = {
    register,
    log,
    validate,
    reset,
    forgot,
    login
}
