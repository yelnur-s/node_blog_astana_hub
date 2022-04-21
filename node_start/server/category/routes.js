const express = require("express");
const router = express.Router();


const {createCategories} = require('./seed');
createCategories();





module.exports = router;