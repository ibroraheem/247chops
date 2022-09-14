const Admin = require('../model/admin');
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


const register = async (req, res) => {
    const { username, email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin) return res.status(400).send('Admin already registered');
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

const login = async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).send('Email is wrong');
    const validPass = await bcrypt.compare(password, admin.password);
    if (!validPass) return res.status(400).send('Invalid password');
    const token = jwt.sign({ email: admin.email, role: admin.role }, process.env.TOKEN_SECRET);
    res.status(200).json({ message: 'Admin logged in successfully', token });
}

const getUsers = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    try {
        if (decoded.role === 'admin') {
            const users = await User.find();
            res.send(users);
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const deleteUser = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    try {
        if (decoded.role === 'admin') {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'User deleted successfully' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const getUser = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    try {
        if (decoded.role === 'admin') {
            const user = await User.findById(req.params.id);
            res.status(200).json({ message: 'User fetched successfully', user });
        }
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

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

module.exports = { register, login, getUsers, getUser, deleteUser, forgotPassword, resetPassword }