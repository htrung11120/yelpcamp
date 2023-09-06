const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema, reviewSchema } = require('../schemas.js');
const Review = require('../models/review');
const { isLoggedIn, storeReturnTo, isReviewAuthor } = require('../middleware')
const { createReview, deleteReview } = require('../controllers/reviews')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
router.post('/:id/reviews', isLoggedIn, validateReview, catchAsync(createReview))
router.delete('/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(deleteReview))
module.exports = router