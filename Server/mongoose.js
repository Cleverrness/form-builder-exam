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
const form_list_schema = new Schema({
    id:  Number, // String is shorthand for {type: String}
    name: String,
    numOfSubmissions:   Number,
    LinkToSubmit: String,
    LinkToSubmission: String
});

// A Schema that represents a question in a form
const question_schema = new Schema({
    label: String,
    name: String,
    type: String
})

// Field Line in form Builder Schema
const form_builder = new Schema({
    form_id: Number,
    Questions: [question_schema]
});

// A Schema that represents an answer of a question in the form
// const submission_answer = new Schema({
//     qName: String,
//     qAns: String
// })

// Submissions Schema to hold all the answers of a form
const submissions_schema = new Schema({
    form_id: Number,
    Answers: [Schema.Types.Mixed]
}, {strict: false})

// Create the Specific Collection
const a_form_list = mongoose.model('allforms', form_list_schema);
const form_builder_collection = mongoose.model('existing_forms', form_builder);
const submissions_collection = mongoose.model('submissions', submissions_schema);

/**
 * This Function will retrieve all forms in the DB
 * @returns {Promise<*>} an array of all the form in the DB
 */
async function get_all_forms(){
    const all_forms = await a_form_list.find().lean();
    return all_forms;
};

/**
 * This Function generates the next id of the form to be created
 * it gets the last inserted doc with the highest id
 * and returns this id + 1
 * @returns {Promise<number|*>} when resolved the number is next id to be used with
 */
async function get_next_form_id() {
    const all_forms = await a_form_list.find().sort({id: -1}).limit(1);
    if(all_forms.length === 0)
    {
        return 0;
    }
    else
    {
        return (all_forms[0]._doc.id + 1);
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
    if(!(name instanceof String || typeof name === 'string') || !questions)
    {
        throw {message: "error adding new form, wrong params "};
    }
    //TODO: deal with the race condition of 2 or more users adding new form on the same time
    //get the id for the new form and the relevant urls
    let count_forms = await get_next_form_id();
    let submit_url = host + "/forms/submit/" + count_forms;
    let submission_url = host + "/forms/submission/" + count_forms;

    console.log("The form id " + count_forms)


    // build the new form
    let build_form = new form_builder_collection({
        form_id: count_forms,
        Questions: questions
    })

    //add the new form to the form list
    let new_form = new a_form_list({
        id: count_forms,
        name: name,
        numOfSubmissions: 0,
        LinkToSubmission: submission_url,
        LinkToSubmit: submit_url
    })

    // save to DB
    try{
        await build_form.save();
        await new_form.save();
    }
    catch (error) {
        throw {message: "documents were not saved"};
    }

}

/**
 * This Function is getting a form id
 * and returns an array of all of its questions
 * @param form_id - the id of the form to retrieve its qeustions
 * @returns {Promise<[]>} the questions array
 */
async function get_form_question(form_id)
{
    const form = await form_builder_collection.findOne({form_id: form_id});

    if(form) {
        let form_questions = [];
        form._doc.Questions.forEach((qstnElem) => {
            let qstn = {
                label: qstnElem._doc.label,
                name: qstnElem._doc.name,
                type: qstnElem._doc.type
            }
            form_questions.push(qstn);
        })

        return form_questions;
    }
    else
    {
        throw {message: "Could not find the doc"}
    }
}

/**
 * This Function is submitting the answers the user send to a form
 * @param form_id - the id of the form to submit the answers to
 * @param answers - the answers of the user
 * @returns {Promise<void>}
 */
async function submit_answers(form_id, answers)
{
    //TODO: deal with race condition of 2 or more users submitting answers on the same time
    let all_submissions = await submissions_collection.findOne({form_id: form_id}).lean();
    if(!all_submissions)
    {
        let new_submission = new submissions_collection({
            form_id: form_id,
            Answers: answers
        });
        await new_submission.save();
    }
    else
    {
        //Create an array of the form questions names
        let form_qsts = await get_form_question(form_id);
        let question_names = [];
        form_qsts.forEach((question) => {
            question_names.push(question.name);
        });

        //Create Array of already submitted answers
        let appended_answers = all_submissions.Answers;
        // all_submissions.Answers.forEach((ansr) => {
        //     question_names.forEach((q_name) => {
        //         if(ansr[q_name])
        //         {
        //             let actual_answer = {}
        //             actual_answer[q_name] = ansr[q_name];
        //             appended_answers.push(actual_answer);
        //         }
        //
        //     })
        // })




        //Append the question to the already submitted answers only if the question name belongs to this form
        // Object.keys(answers).forEach((ansr_name) => {
        //
        // })
        if(!checkIncludesAll(Object.keys(answers), question_names))
        {
            throw {message: "Question name does not belong to this form"}
        }
        appended_answers.push(answers);


        //Update the submissions
        await submissions_collection.findOneAndUpdate({form_id: form_id}, {Answers: appended_answers});



    }
    await update_submission_number(form_id);
}

/**
 * this functions will check
 * @param included - the array to check if it is included in the other array
 * @param inclusive - the array to check if it contains the other array
 * @returns {boolean}
 */
function checkIncludesAll(included, inclusive){
    for(var i = 0; i < included.length; i++){
        if(inclusive.indexOf(included[i]) === -1)
            return false;
    }
    return true;
}


/**
 * This function is incrementing the number of applied submissions
 * @param form_id - the id of the form to increment submission for
 * @returns {Promise<void>}
 */
async function update_submission_number(form_id)
{
    const form = await a_form_list.findOne({id: form_id}).lean();
    await a_form_list.findOneAndUpdate({id: form_id}, {numOfSubmissions: (form.numOfSubmissions + 1)})

}

/**
 * This function returns an array of all the answers that were submitted to a form_id
 * @param form_id - the id of the form to retrieve its answers
 * @returns {Promise<[]>}
 */
async function get_submissions_by_id(form_id)
{
    const all_submissions = await submissions_collection.findOne({form_id: form_id}).lean();

    //Beautify the Answers array
    let answers = all_submissions.Answers;


    return answers
}

module.exports = {mongoose, add_new_form, get_all_forms, get_form_question, submit_answers, get_submissions_by_id}