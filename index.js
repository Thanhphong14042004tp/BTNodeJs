const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config');
const Booking = require('./models/Booking');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Kết nối MongoDB
connectDB();

// Trang hiển thị danh sách đặt chỗ
app.get('/', async (req, res) => {
    const bookings = await Booking.find();
    res.render('index', { bookings });
});

// Trang đặt chỗ mới
app.get('/new', (req, res) => {
    res.render('new_booking');
});

app.post('/new', async (req, res) => {
    const { customerName, date, time } = req.body;
    const newBooking = new Booking({ customerName, date, time });
    await newBooking.save();
    res.redirect('/');
});

// Trang chỉnh sửa đặt chỗ
app.get('/edit/:id', async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    res.render('edit_booking', { booking });
});

app.post('/edit/:id', async (req, res) => {
    const { customerName, date, time } = req.body;
    await Booking.findByIdAndUpdate(req.params.id, { customerName, date, time });
    res.redirect('/');
});

// Hủy đặt chỗ
app.get('/cancel/:id', async (req, res) => {
    await Booking.findByIdAndUpdate(req.params.id, { status: 'Cancelled' });
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
