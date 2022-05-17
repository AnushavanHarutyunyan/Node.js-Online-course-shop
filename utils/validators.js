const { body } = require('express-validator');
const User = require('../models/user');

exports.registerValidator = [
    body('email')
        .isEmail()
        .withMessage('Ввидитье правильный email')
        .custom(async (value, { req }) => {
            try {
                const user = await User.findOne({ email: value });
                if (user) {
                    return Promise.reject('Пользователь уже зарегистрированs');
                }
            } catch (e) {
                console.log(e);
            }
        })
        .normalizeEmail(),
    body('password', 'Пароль должен быть минимум 6 символов').isLength({
        min: 6,
        max: 10,
    }),
    body('confirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Пароли должны совпадать');
        }
        return true;
    }),
    body('name', 'Имя должно быть минимум 6 символов')
        .isLength({
            min: 3,
            max: 10,
        })
        .trim(),
];

exports.courseValidator = [
    body('title', 'Минимальная длина должна быть не менее 3 символа')
        .isLength({
            min: 3,
        })
        .trim(),
    body('price', 'Введитье корректную цену').isNumeric(),
    body('img', 'Введитье корректный URL').isURL(),
];
