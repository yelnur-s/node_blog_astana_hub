
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/astana_hub').then(() => {
    console.log("Connected to MongoDB");
}).catch(() => {
    console.log("Failed to connect to MongoDB");
});

