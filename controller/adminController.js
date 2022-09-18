/* This is importing the required modules. */
const Admin = require('../model/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');



/**
 * It checks if there's an admin in the database, if there is, it returns an error, if there isn't, it
 * creates a new admin.
 * @param req - request
 * @param res - the response object
 * @returns a promise.
 */
const register = async (req, res) => {
    const { username, email, password } = req.body;
    const isExisting = await Admin.countDocuments === 1;
    if (isExisting) return res.status(400).send('Admin already exists');
    try {
        const hash = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({
            username,
            email,
            password: hash
        });
        const savedAdmin = await newAdmin.save();
        const token = jwt.sign({ email: savedAdmin.email, }, process.env.TOKEN_SECRET);
        res.status(201).json({ message: 'Admin created successfully', token });
    } catch (err) {
        res.status(400).send(err);
    }
}

/**
 * It takes the email and password from the request body, finds the admin in the database, compares the
 * password with the one in the database, and if it's valid, it signs a token and sends it back to the
 * client.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The token is being returned.
 */
const login = async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).send('Email is wrong');
    const validPass = await bcrypt.compare(password, admin.password);
    if (!validPass) return res.status(400).send('Invalid password');
    const token = jwt.sign({ email: admin.email, role: admin.role }, process.env.TOKEN_SECRET);
    res.status(200).json({ message: 'Admin logged in successfully', token });
}



/**
 * It takes the email from the request body, finds the admin with that email, creates a token, saves
 * the token to the database, sends an email with a link to reset the password, and returns a message
 * to the user
 * @param req - The request object.
 * @param res - the response object
 */
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        await Admin.findOne({ email }).then((admin) => {
            if (!admin) return res.status(401).json({ message: 'Email is invalid' });
            const token = jwt.sign({ email: admin.email }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
            admin.passwordResetToken = token;
            admin.save();
            const transporter = nodemailer.createTransport({
                host: 'smtp.zoho.eu',
                port: 465,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Reset Password',
                html: `<h1>Reset Password</h1>
                <p>Click on the link to reset your password</p>
                <a href="http://localhost:3000/reset-password/${token}">Reset Password</a>`
            };
            transporter.sendMail(mailOptions, (err, response) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Email sent');
                }
            });
            res.status(200).json({ message: 'Email sent successfully' });
        })
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}


/**
 * It takes a password and a token from the request body and then finds the admin with the matching
 * token. If the admin is found, it hashes the password and saves the admin. If the admin is not found,
 * it returns an error
 * @param req - The request object.
 * @param res - The response object.
 * @returns a function.
 */
const resetPassword = async (req, res) => {
    const { password } = req.body;
    const token = req.params.token;
    try {
        const admin = await Admin.findOne({ passwordResetToken: token });
        if (!admin) return res.status(401).json({ message: 'Token is invalid' });
        const hash = await bcrypt.hash(password, 10);
        admin.password = hash;
        admin.passwordResetToken = '';
        admin.save();
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

/* Exporting the functions. */
module.exports = { register, login, forgotPassword, resetPassword }