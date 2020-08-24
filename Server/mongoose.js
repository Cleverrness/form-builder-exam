const mongoose = require("mongoose");

// Configure mongoose with my DB
// Create my relevant Schemas
const Schema = mongoose.Schema;
mongoose.connect('mongodb+srv://galUser:Wixexam123%21@cluster0.zkrn1.gcp.mongodb.net/Forms?retryWrites=true&w=majority', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
    console.log("DB is now open");
});
// List Schema
const formListSchema = new Schema({
    id:  Number, // String is shorthand for {type: String}
    name: String,
    numOfSubmissions:   Number,
    LinkToSubmit: String,
    LinkToSubmission: String
});

// A Schema that represents a question in a form
const questionSchema = new Schema({
    label: String,
    name: String,
    type: String
})

// Field Line in form Builder Schema
const formBuilder = new Schema({
    form_id: Number,
    Questions: [questionSchema]
});

// A Schema that represents an answer of a question in the form
const submissionAnswer = new Schema({
    qName: String,
    qAns: String
})

// Submissions Schema to hold all the answers of a form
const submissionsSchema = new Schema({
    form_id: Number,
    Answers: [submissionAnswer]
})

// Create the Specific Collection
const aFormList = mongoose.model('allforms', formListSchema);
const formBuilderCollection = mongoose.model('existing_forms', formBuilder);
const submissionsCollection = mongoose.model('submissions', submissionsSchema);

/**
 * This Function will retrieve all forms in the DB
 * @returns {Promise<*>} an array of all the form in the DB
 */
async function getAllForms(){
    const allForms = await aFormList.find();
    console.log("Waiting for all forms to be retrieved")
    return allForms;
};

/**
 * This Function generates the next id of the form to be created
 * it gets the last inserted doc with the highest id
 * and returns this id + 1
 * @returns {Promise<number|*>} when resolved the number is next id to be used with
 */
async function getNextFormId() {
    const allForms = await aFormList.find().sort({id: -1}).limit(1);
    if(allForms.length === 0)
    {
        return 0;
    }
    else
    {
        return (allForms[0]._doc.id + 1);
    }
}

/**
 * This Function adds a new form to the DB if the values are correct
 * @param name - the name of the form
 * @param host - the host parent of the url
 * @param questions - the array of questions belongs to this form
 * @returns {Promise<void>} if the document was not saved successfully throws exception
 */
async function add_new_form(name, host, questions)
{
    // check if the name is string
    if(!(name instanceof String || typeof name === 'string'))
    {
        throw {message: "error adding new form, wrong params "};
    }

    //get the id for the new form and the relevant urls
    let countForms = await getNextFormId();
    let submit_url = host + "/forms/submit/" + countForms;
    let submission_url = host + "/forms/submission/" + countForms;
    console.log("Count is " + countForms)

    // build the new form
    let buildForm = new formBuilderCollection({
        form_id: countForms,
        Questions: questions
    })

    //add the new form to the form list
    let newForm = new aFormList({
        id: countForms,
        name: name,
        numOfSubmissions: 0,
        LinkToSubmission: submission_url,
        LinkToSubmit: submit_url
    })

    // save to DB
    try{
        await buildForm.save();
        await newForm.save();
    }
    catch (error) {
        console.error(error)
        throw {message: "documents were not saved"};
    }

}

/**
 * This Function is getting a form id
 * and returns an array of all of its questions
 * @param form_id - the id of the form to retrieve its qeustions
 * @returns {Promise<[]>} the questions array
 */
async function getFormQuestion(form_id)
{
    const form = await formBuilderCollection.findOne({form_id: form_id});

    let form_questions = [];
    form._doc.Questions.forEach((qstnElem) => {
        let qstn = {
            label: qstnElem._doc.label,
            name: qstnElem._doc.name,
            type: qstnElem._doc.type
        }
        form_questions.push(qstn);
        console.log(qstn);
    })

    return form_questions;
}

/**
 * This Function is submitting the answers the user send to a form
 * @param form_id - the id of the form to submit the answers to
 * @param answers - the answers of the user
 * @returns {Promise<void>}
 */
async function submitAnswers(form_id, answers)
{
    let all_submissions = await submissionsCollection.findOne({form_id: form_id}).lean();
    if(!all_submissions)
    {
        let new_submission = new submissionsCollection({
            form_id: form_id,
            Answers: answers
        });
        await new_submission.save();
    }
    else
    {
        let appended_answers = [];
        all_submissions.Answers.forEach((ansr) => {
            let actual_answer = {
                qName: ansr.qName,
                qAns: ansr.qAns
            }
            appended_answers.push(actual_answer);
        })

        //Create an array of the form questoins names
        let form_qsts = await getFormQuestion(form_id);
        let question_names = [];
        form_qsts.forEach((question) => {
            question_names.push(question.name);
        });

        //Append the question to the already submitted answers only if the question name belongs to this form
        answers.forEach((new_ansr) => {
            if(!question_names.includes(new_ansr.qName))
            {
                throw {message: "Question name does not belong to this form"}
            }
            appended_answers.push(new_ansr);
        })

        //Update the submissions
        await submissionsCollection.findOneAndUpdate({form_id: form_id}, {Answers: appended_answers});
        await update_submission_number(form_id);

        // console.log(appended_answers);

    }
}

async function update_submission_number(form_id)
{
    const form = await aFormList.findOne({id: form_id});

}

module.exports = {mongoose, add_new_form, getAllForms, getFormQuestion, submitAnswers}