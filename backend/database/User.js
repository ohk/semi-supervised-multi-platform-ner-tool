const pool = require('./pool')
const Email = require('../middleware/emailSender')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')

log = async (data) => {
    try {
        var conneciton = await pool.getPool()
        data.country === 'unknown' ? (country = 'TR') : (country = data.country)
        const saveQuery = {
            text:
                'INSERT INTO loginlog( ipaddress,  os, platform, browser, device_type, country, city, userid) VALUES ( $1,$2,$3,$4,$5,$6,$7,$8)',
            values: [
                data.ipaddress,
                data.os,
                data.platform,
                data.browser,
                data.device_type,
                country,
                data.city,
                data.userID
            ]
        }
        saveLog = await conneciton.query(saveQuery)
        if (saveLog.rowCount === 1) {
            return { success: true, message: 'Log is created' }
        } else {
            return { success: false, message: 'Log is not created' }
        }
    } catch (error) {
        return { success: false, message: 'Log is not created' }
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

        await Email.verificationMail(data.email, validationKey)

        if (saveUser.rowCount === 1) {
            return { status: true, message: 'User is succesfully registered' }
        }
    } catch (error) {
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
            if (check.rows[0].validation === false) {
                userID = check.rows[0].userid
                validationKey = jwt.sign({ id: userID }, process.env.TOKEN_SECRET || 'jhfasjkbhfjkashfjkajhj')
                await Email.verificationMail(check.rows[0].email, validationKey)
                return { status: false, message: 'Please confirm your account' }
            }
            userID = check.rows[0].userid
            check.rows[0].role === 0 ? (isAdmin = true) : (isAdmin = false)
            data['userID'] = userID
            await log(data)
            token = jwt.sign({ id: userID }, process.env.TOKEN_SECRET || 'jhfasjkbhfjkashfjkajhj')
            return {
                status: true,
                isAdmin: isAdmin,
                user_id: userID,
                token: token,
                message: 'Login credentials are correct'
            }
        }
    } else {
        return { status: false, message: 'Login credentials are incorrect' }
    }
}

forgot = async (data) => {
    try {
        var conneciton = await pool.getPool()

        const query = {
            text: 'SELECT * FROM users WHERE username = $1 OR email = $1',
            values: [data.loginCredit]
        }

        check = await conneciton.query(query)
        if (check.rows.length != 0) {
            userID = check.rows[0].userid
            const isExistQuery = {
                text: 'SELECT * FROM forgotpassword WHERE userid = $1 AND status = 0',
                values: [userID]
            }
            isExist = await conneciton.query(isExistQuery)
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
                await Email.forgotPasswordMail(check.rows[0].email, hashedKey)
                return { status: true, key: hashedKey, message: 'Data confirmed' }
            } else {
                await Email.forgotPasswordMail(check.rows[0].email, isExist.rows[0].hashedKey)
                return { status: true, key: isExist.rows[0].hashedKey, message: 'Data confirmed' }
            }
        } else {
            return { status: false, message: 'Login credentials are incorrect' }
        }
    } catch (error) {
        return { status: false, message: error }
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

validate = async (data) => {
    try {
        var conneciton = await pool.getPool()
        const verified = jwt.verify(data.key, process.env.TOKEN_SECRET || 'jhfasjkbhfjkashfjkajhj')
        const updateQuery = {
            text: 'UPDATE users SET validation=true WHERE userid= $1',
            values: [verified.id]
        }
        validate = await conneciton.query(updateQuery)
        if (validate.rowCount == 1) {
            return { status: true, message: 'Your account has been successfully validated' }
        } else {
            return { status: false, message: 'Your account has not been successfully validated' }
        }
    } catch (error) {
        return { status: false, message: error }
    }
}

isUserAdmin = async (data) => {
    try {
        var conneciton = await pool.getPool()
        const query = {
            text: 'SELECT * FROM users WHERE userid= $1 AND role = 0',
            values: [data.id]
        }
        admin = await conneciton.query(query)
        if (admin.rowCount == 1) {
            return { status: true, message: 'Hello Admin' }
        } else {
            return { status: false, message: 'Meh! You are not an admin!' }
        }
    } catch (error) {
        return { status: false, message: error }
    }
}

list = async (data) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text:
                'SELECT userid,name,surname,username,email,role,textcount,requestcount,validation FROM users ORDER BY createdat DESC LIMIT $1 OFFSET $2',
            values: [data.rows, data.offset]
        }
        user = await conneciton.query(query)
        const queryC = {
            text: 'SELECT COUNT(*) FROM users'
        }
        count = await conneciton.query(queryC)
        return { status: true, data: user.rows, count: count.rows[0].count }
    } catch (error) {
        return { status: false, data: [] }
    }
}

blockUser = async (paramid) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'UPDATE users SET role=-1 WHERE userid = $1',
            values: [paramid]
        }
        block = await conneciton.query(query)
        if (block.rowCount == 1) {
            return { status: true, message: 'User Blocked' }
        } else {
            return { status: false, message: 'Error' }
        }
    } catch (error) {
        return { status: false, message: error }
    }
}

makeAdmin = async (paramid) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'UPDATE users SET role=0 WHERE userid = $1',
            values: [paramid]
        }
        console.log(query)
        admin = await conneciton.query(query)
        if (admin.rowCount == 1) {
            return { status: true, message: 'User Admin' }
        } else {
            return { status: false, message: 'Error' }
        }
    } catch (error) {
        return { status: false, message: error }
    }
}

makeUser = async (paramid) => {
    try {
        var conneciton = pool.getPool()
        const query = {
            text: 'UPDATE users SET role=1 WHERE userid = $1',
            values: [paramid]
        }
        console.log(query)
        admin = await conneciton.query(query)
        if (admin.rowCount == 1) {
            return { status: true, message: 'User now user' }
        } else {
            return { status: false, message: 'Error' }
        }
    } catch (error) {
        return { status: false, message: error }
    }
}
module.exports = {
    register,
    log,
    validate,
    reset,
    forgot,
    login,
    isUserAdmin,
    list,
    blockUser,
    makeAdmin,
    makeUser
}
