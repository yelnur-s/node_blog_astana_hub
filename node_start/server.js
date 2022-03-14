const express = require("express");
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/astana_hub').then(() => {
    console.log("Connected to MongoDB");
}).catch(() => {
    console.log("Failed to connect to MongoDB");
});

const app = express();
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    console.log("Api Works");

    res.render("index.ejs");
})

app.listen(3000, () => console.log("Server is listening on port 3000"));


// const Blog = require("./models/Blog");

// new Blog({
//     title: "Second blog",
//     description: "Second desc"
// }).save();

