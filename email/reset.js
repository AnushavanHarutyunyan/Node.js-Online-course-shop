const keys = require('../keys');

module.exports = function (email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Accaunt reset',
        html: `
            <h1>Восстоновления паролья</h1>
            <p>Для восстоновления паролья перейдитье по ссылке</p>
            <p><a href='${keys.BASE_URL}/auth/password/${token}'>Сбросить пароль</a></p>
        `,
    };
};
