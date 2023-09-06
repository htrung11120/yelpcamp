const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const passport = require('passport')
const { storeReturnTo } = require('../middleware')
const { renderRegister, register, loginRender, loginAuthentication, logout } = require('../controllers/user')


router.get('/register', renderRegister);

router.post('/register', register);

router.get('/login', loginRender);
router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), loginAuthentication);

router.get('/logout', logout);
module.exports = router