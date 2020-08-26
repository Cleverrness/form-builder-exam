const express = require("express");
const router = express.Router();
const mongoose = require("../mongoose");


router.get("/all_forms", async (req,res,next) => {
    try{
        let all_forms = await mongoose.get_all_forms();
        //Beautify the array
        let new_forms_array = []
        all_forms.forEach((form) => {
            new_forms_array.push({
                id: form.id,
                name: form.name,
                numOfSubmissions: form.numOfSubmissions,
                LinkToSubmission: form.LinkToSubmission,
                LinkToSubmit: form.LinkToSubmit
            })
        })
        res.send(new_forms_array)

    }catch (error) {
        next(error);
    }
})

/**
 * This endpoint will create a new form in the DB
 * the form parameters (question and name) should be implemented in the req body
 */
router.post("/new_form", async (req, res, next) => {
    console.log("req.body=" + req.body)
    let {name, questions} = req.body;
    let {host} = req.headers;
    console.log("adding new form " + name + questions)
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

        const questions = await mongoose.get_form_question(form_id);

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

        await mongoose.submit_answers(form_id, answers);

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