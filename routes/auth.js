const { Router } = require('express');
const router = Router();
const bcript = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const { registerValidator } = require('../utils/validators');
const User = require('../models/user');
const sendgrid = require('nodemailer-sendgrid-transport');
const nodemailer = require('nodemailer');
const keys = require('../keys');
const regEmail = require('../email/registration');
const resetPassword = require('../email/reset');

const transporter = nodemailer.createTransport(
    sendgrid({
        auth: { api_key: keys.SENDGRID_API_KEY },
    })
);

router.get('/login', (req, res) => {
    res.render('auth/login', {
        title: 'Authent',
        isLogin: true,
        regError: req.flash('regError'),
        logError: req.flash('logError'),
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
});

router.post('/login', registerValidator, async (req, res) => {
    try {
        const { email, password } = req.body;
        const candidate = await User.findOne({ email });
        const error = validationResult(req);
        if (candidate) {
            const areSame = await bcript.compare(password, candidate.password);
            if (areSame) {
                const user = candidate;
                req.session.isAuthenticated = true;
                req.session.user = user;
                req.session.save((err) => {
                    if (err) {
                        throw err;
                    }
                    res.redirect('/');
                });
            } else {
                req.flash('logError', 'Непрвилбный логин или пароль');
                res.redirect('/auth/login#login');
            }
        } else {
            req.flash('logError', 'Такого пользователя не существует');
            res.redirect('/auth/login#login');
        }
    } catch (e) {
        console.log(e);
    }
});

router.post('/register', registerValidator, async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('regError', errors.array()[0].msg);
            return res.status(422).redirect('/auth/login#register');
        }

        const hashPassword = await bcript.hash(password, 10);
        const user = new User({
            email,
            name,
            password: hashPassword,
            cart: { items: [] },
        });
        await user.save();
        await transporter.sendMail(regEmail(email));
        res.redirect('/auth/login#login');
    } catch (e) {
        console.log(e);
    }
});

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Восстоновления паролья',
        error: req.flash('error'),
    });
});

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Возникли проблемы ....');
                return res.redirect('/auth/reset');
            }
            const candidate = await User.findOne({ email: req.body.email });

            if (candidate) {
                const token = buffer.toString('hex');
                const date = Date.now() + 3600 * 1000;
                (candidate.resetToken = token),
                    (candidate.resetTokenExp = date);
                await candidate.save();
                transporter.sendMail(resetPassword(candidate.email, token));
                res.redirect('/auth/login');
            } else {
                req.flash('error', 'Пользватель не найден');
                res.redirect('/auth/reset');
            }
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login');
    }
    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: { $gt: Date.now() },
        });

        if (!user) {
            res.redirect('/auth/login');
        } else {
            res.render('auth/password', {
                title: 'Сбросить пароль',
                error: req.flash('error'),
                token: req.params.token,
                userId: user._id.toString(),
            });
        }
    } catch (e) {
        console.log(e);
    }
});

router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: { $gt: Date.now() },
        });

        if (user) {
            user.password = await bcript.hash(req.body.password, 10);
            (user.resetToken = undefined), (user.resetTokenExp = undefined);
            await user.save();
            res.redirect('/auth/login');
        } else {
            req.flash('error', 'пользователь не найдень');
            res.redirect('/auth/login');
        }
    } catch (e) {
        console.log(e);
    }
});
module.exports = router;
