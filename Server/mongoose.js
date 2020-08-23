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

// Line in form Builder Schema
const lineBuilder = new Schema({
    label: String,
    inputName: String,
    inputType: String
});

// Form Builder Schema
const formBuilder = new Schema({
    linesInForm: [lineBuilder]
});

// Create the Specific Collection
let aFormList = mongoose.model('allforms', formListSchema);

// This Function will retrieve all forms in the DB
async function getAll(){
    const allForms = await aFormList.find();
    console.log("Waiting for all forms to be retrieved")
    return allForms;
};

async function getNextId() {
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

// This Function adds a new form to the DB if the values are correct
async function add_new_form(name,num_of_submissions, link_submit, link_submission)
{
    if(!(name instanceof String || typeof name === 'string') ||
        !(Number.isInteger(num_of_submissions)) ||
        !(link_submission instanceof String || typeof link_submission === 'string') ||
        !(link_submit instanceof String || typeof link_submit === 'string'))
    {
        throw {message: "error adding new form, wrong params "};
    }
    let countForms = await getNextId();
    console.log("Count is " + countForms)
    let newForm = new aFormList({
        id: countForms,
        name: name,
        numOfSubmissions: num_of_submissions,
        LinkToSubmission: link_submission,
        LinkToSubmit: link_submit
    })

    await newForm.save();
}



module.exports = {mongoose, add_new_form, getAll}