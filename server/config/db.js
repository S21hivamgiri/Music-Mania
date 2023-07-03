const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://0.0.0.0:27017/musicmania', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("connected to MongoDB");
    }
    catch {
        console.log('error');
    }
}

connect();