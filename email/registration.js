const keys = require('../keys');

module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Account created',
        html: `
            <h1>Welcome to my Test_API</h1>
            <p>Accaunt Created</p>
            <hr/>
        `,
    };
};
