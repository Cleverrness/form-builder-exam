const express = require("express");
const router = express.Router();
const mongoose = require("../mongoose");


router.post("/new_form", (req, res, next) => {
    let {name, num_of_submission,link_sms,link_sub} = req.body;
    mongoose.add_new_form(name,num_of_submission,link_sub,link_sms);
})

module.exports = router;