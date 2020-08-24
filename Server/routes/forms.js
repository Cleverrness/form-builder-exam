const express = require("express");
const router = express.Router();
const mongoose = require("../mongoose");

/**
 * This endpoint will create a new form in the DB
 * the form parameters (question and name) should be implemented in the req body
 */
router.post("/new_form", async (req, res, next) => {
    let {name, questions} = req.body;
    let {host} = req.headers;
    try{
        await mongoose.add_new_form(name, host, questions);
        res.sendStatus(200);
    }
    catch (error) {
        next(error);
    }
})

/**
 * This endpoint will return a form questions in order to submit it
 */
router.get("/submit/:form_id", async (req, res, next) =>{
    try{
        const {form_id} = req.params;

        const questions = await mongoose.getFormQuestion(form_id);

        res.status(200).send(questions);

    }catch (error) {
        next(error)
    }
})

/**
 * This endpoint will post the form answers of a user
 */
router.post("/submit", async (req,res,next) => {
    try{
        let {form_id,answers} = req.body;
        if(!form_id || !answers)
        {
            throw {message: "Wrong parameters received"}
        }

        await mongoose.submitAnswers(form_id, answers);

        res.sendStatus(201);


    }catch (error) {
        next(error);
    }
})

/**
 * This endpoint will return all the answers that were submitted to the form by its id
 */
router.get("/submission/:form_id", async (req, res, next) => {
    try{
        const {form_id} = req.params;

        const answers = await mongoose.get_submissions_by_id(form_id);

        res.status(200).send(answers);

    }catch (error) {
        next(error)
    }
})

module.exports = router;