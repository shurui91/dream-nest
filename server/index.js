const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');

const authRoutes = require('./routes/auth.js');
const listingRoutes = require('./routes/listing.js');
const bookingRoutes = require('./routes/booking.js');
const userRoutes = require('./routes/user.js');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ROUTES
app.use('/auth', authRoutes);
app.use('/properties', listingRoutes);
app.use('/bookings', bookingRoutes);
app.use('/users', userRoutes);

// MONGOOSE SETUP
mongoose
    .connect(process.env.MONGO_URL, {
        dbName: 'NextJSCluster',
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(
                `It works!! Server running on port ${process.env.PORT}`
            );
        });
    })
    .catch((err) => console.log(`${err} did not connect.`));
