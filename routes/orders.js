const { Router } = require('express');
const auth = require('../middleware/auth');
const router = Router();
const Order = require('../models/order');

router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({
            'user.userId': req.user._id,
        }).populate('user.userId');

        res.render('orders', {
            title: 'Заказы',
            isOrder: true,
            orders: orders.map((o) => {
                return {
                    ...o._doc,
                    price: o.courses.reduce((total, c) => {
                        return (total += c.count * c.course.price);
                    }, 0),
                };
            }),
        });
    } catch (e) {
        console.log(e);
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.courseId');
        const courses = user.cart.items.map((item) => ({
            count: item.count,
            course: { ...item.courseId._doc },
        }));
        const order = new Order({
            courses,
            user: {
                name: req.user.name,
                userId: req.user,
            },
        });
        await order.save();
        await req.user.clearCart();
        res.redirect('/orders');
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
