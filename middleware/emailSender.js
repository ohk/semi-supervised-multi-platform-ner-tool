const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    host: process.env.EMAILHOST,
    port: process.env.EMAILPORT,
    secure: process.env.EMAILSECURE,
    auth: {
        user: process.env.EMAILUSERNAME,
        pass: process.env.EMAILPASSWORD
    }
})

verificationMail = async (emailAddress, verificationKey) => {
    let info = await transporter.sendMail({
        from: `"YTUCE NER TOOL" <${process.env.EMAILUSERNAME}>`,
        to: emailAddress,
        subject: 'Verification Email',
        text: 'TEXT',
        html: '<b>Hello world?</b>'
    })
}

forgotPasswordMail = async (emailAddress) => {
    let info = await transporter.sendMail({
        from: `"YTUCE NER TOOL" <${process.env.EMAILUSERNAME}>`,
        to: emailAddress,
        subject: 'Verification Email',
        text: 'TEXT',
        html: '<b>Hello world?</b>'
    })
}

module.exports = {
    verificationMail,
    forgotPasswordMail
}
