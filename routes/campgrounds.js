const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema, reviewSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor } = require('../middleware')
const { index, renderNewForm, createCampgrounds, showCampgrounds, renderEditForm, updateCampground, deleteCampground } = require('../controllers/campgrounds')

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.get('/', catchAsync(index));

router.get('/new', isLoggedIn, renderNewForm)


router.post('/', validateCampground, catchAsync(createCampgrounds))

router.get('/:id', catchAsync(showCampgrounds));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(renderEditForm))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(deleteCampground));

module.exports = router