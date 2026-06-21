const mongoose = require('mongoose');

const connectWithRetry = () => {
    console.log('Attempting MongoDB connection...');

    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log('MongoDB connected successfully'))
        .catch((err) => {
            console.error('MongoDB connection failed. Retrying in 5 seconds...', err.message);
            setTimeout(connectWithRetry, 5000);
        });
};

module.exports = connectWithRetry;
