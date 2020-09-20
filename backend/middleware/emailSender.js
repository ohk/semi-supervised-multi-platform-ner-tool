const nodemailer = require('nodemailer')
const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE,
    EMAIL_USERNAME,
    EMAIL_PASSWORD,
    EMAIL_NAME,
    DOMAIN
} = require('../config')

let transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_SECURE,
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
    }
})

verificationMail = async (emailAddress, verificationKey) => {
    let info = await transporter.sendMail({
        from: `"${EMAIL_NAME}" <${EMAIL_USERNAME}>`,
        to: emailAddress,
        subject: 'Verification Email',
        text: verificationKey,
        html: `${DOMAIN}/validate/${verificationKey}`
    })
    console.log(info)
}

forgotPasswordMail = async (emailAddress, verificationKey) => {
    let info = await transporter.sendMail({
        from: `"${EMAIL_NAME}" <${EMAIL_USERNAME}>`,
        to: emailAddress,
        subject: 'Reset your password',
        text: `${DOMAIN}/reset/${verificationKey}`
    })
}

notificationCount = async (emailAddress) => {
    let info = await transporter.sendMail({
        from: `"${EMAIL_NAME}" <${EMAIL_USERNAME}>`,
        to: emailAddress,
        subject: 'Train System',
        text: 'Sistem eğitilebilir durumda.'
    })
}

module.exports = {
    verificationMail,
    forgotPasswordMail,
    notificationCount
}
