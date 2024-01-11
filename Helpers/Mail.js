const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { UserVerification } = require('../Models/Verification.js');

const sendEmail = async (email, id, type,) => {
    try {
        const currentUrl = "http://localhost:3000/";

        // create Unique string
        const uniqueString = uuidv4() + id;

        // mail transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.MAIL,
                pass: process.env.PASSWORD,
            },
        });

        let subject, linkText;

        if (type === 'verify') {
            subject = 'Verify Account';
            linkText = 'Verify your email address to complete signup';
        } else if (type === 'reset-password') {
            subject = 'Reset Password';
            linkText = 'Click the link to reset your password';
        }

        const mailOptions = {
            from: process.env.MAIL,
            to: email,
            subject: subject,
            html: `<p>${linkText}</p> <p> The Link is <a href=${currentUrl + "api/user/" + type + "/" + id + "/" + uniqueString}> Here <a/> </p>`,
        };

        // hashing unique string
        const salt = 10;
        const hashedUniqueString = await bcrypt.hash(uniqueString, salt);


        const newRequest = new UserVerification({
            userId: id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 21600000
        });

        await newRequest.save().then(() => {
            // send mail
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Send e-mail error: ' + error);
                    return { message: `Couldn't send ${type} email` };
                } else {
                    console.log(`E-mail send (${type}): ` + info.response);
                    return { message: `Successfully sent ${type} email` };
                }
            });

        }).catch((err) => {
            console.log(err);
            throw err
        })


    } catch (error) {
        console.log(error);
        return { message: `An error occurred while processing the ${type} request` };
    }
};

module.exports = {
    sendEmail
};
