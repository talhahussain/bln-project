const mongoose = require("mongoose");

const connectDB = async () => {

    let DATABASE = 'mongodb://127.0.0.1:27017/riding-app';

    await mongoose.connect(DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });

    console.log(`DB connection successful!`);
};


module.exports = connectDB;
