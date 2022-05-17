const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const router = Router();
const { courseValidator } = require('../utils/validators');
const { validationResult } = require('express-validator');
function isOwner(course, req) {
    return course.userId.toString() === req.user._id.toString();
}

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate('userId');
        res.render('courses', {
            title: 'Курсы',
            isCourses: true,
            userId: req.user ? req.user._id.toString() : null,
            courses,
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const courses = await Course.findById(req.params.id);
        res.render('course', {
            title: 'Курсы',
            isCourses: true,
            courses,
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/:id/edit', auth, courseValidator, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }
    try {
        const course = await Course.findByIdAndUpdate(req.params.id);
        if (!isOwner(course, req)) {
            return res.redirect('/courses');
        }
        res.render('course-edit', {
            title: 'Edite course',
            course,
        });
    } catch (e) {
        console.log(e);
    }
});

router.post('/edit', auth, courseValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        const { id } = req.body;
        const course = await Course.findById(id);

        if (!errors.isEmpty()) {
            return res.status(422).render('course-edit', {
                title: 'Edite course',
                error: errors.array()[0].msg,
                course,
            });
        }

        delete req.body.id;
        if (!isOwner(course, req)) {
            return res.redirect('/courses');
        }
        Object.assign(course, req.body);
        await course.save();
        await Course.findByIdAndUpdate(id, req.body);
        res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }
});

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({ _id: req.body.id, userId: req.user._id });
        res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
