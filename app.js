if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

const session = require('express-session');
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user');

const campgroundsRouter = require('./routes/campgrounds.js')
const reviewsRouter = require('./routes/reviews')
const userRouter = require('./routes/user')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
const sessionConfig = {
    secret: 'thishouldbeagoodsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); //set up persistent login (keep user login)
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
});

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: "srfafas@gmail.com", username: 'asdasd' });
    const newUSer = await User.register(user, 'colt');
    res.send(newUSer)
});
app.get('/', catchAsync(async (req, res) => {
    req.flash('success', 'Successfully made a new campground!')
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

app.use('/', userRouter);
app.use('/campgrounds', campgroundsRouter);
app.use('/campgrounds', reviewsRouter);


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
