
const User = require('../models/user')
module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        req.logIn(registerUser, (err) => {
            if (err) { next(err) }
            req.flash('success', 'Welcom to Yelp Camp!')
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('success', `welcome ${username}`)
        res.redirect('/campgrounds')
        req.flash('error', e.message)

    }

}
module.exports.loginRender = (red, res) => {
    res.render('users/login')
}
module.exports.loginAuthentication = (req, res) => {
    const { username } = req.user;
    req.flash('success', `welcome back ${username}`)
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl)
}
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}
