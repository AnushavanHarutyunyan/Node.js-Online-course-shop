const { Router } = require('express');
const Course = require('../models/course');
const router = Router();

function computePrice(courses) {
    return courses.reduce((total, c) => {
        return (total += c.price * c.count);
    }, 0);
}

function mapCartItems(cart) {
    return cart.items.map((c) => ({
        ...c.courseId._doc,
        id: c.courseId.id,
        count: c.count,
    }));
}

router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id);
    await req.user.addToCart(course);
    res.redirect('/card');
});

router.get('/', async (req, res) => {
    const user = await req.user.populate('cart.items.courseId');
    const courses = mapCartItems(user.cart);

    res.render('card', {
        title: 'Корзина',
        isCard: true,
        courses: courses,
        price: computePrice(courses),
    });
});

router.delete('/remove/:id', async (req, res) => {
    await req.user.removeFromCart(req.params.id);
    const user = await req.user.populate('cart.items.courseId');
    const courses = mapCartItems(user.cart);
    const cart = {
        price: computePrice(courses),
        courses,
    };

    res.status(200).json(cart);
});

module.exports = router;
