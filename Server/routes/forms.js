const express = require("express");
const router = express.Router();
const mongoose = require("../mongoose");


router.post("/new_form", async (req, res, next) => {
    let {name, num_of_submission,link_sms,link_sub} = req.body;
    await mongoose.add_new_form(name,num_of_submission,link_sub,link_sms);
    res.sendStatus(200);
})

module.exports = router;