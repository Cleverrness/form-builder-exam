<template>
  <div>
    <div v-if="!isLoaded">
      <b-spinner variant="info"></b-spinner>
    </div>
    <div v-else-if="isError">
      <b-alert :show="dismissCounter" @dismiss-count-down="countDownChanged" variant="danger" @dismissed="closeModal">
        Could not find the requested form<br>
        Please try again later
      </b-alert>
    </div>
    <div v-else>
      <h1 class="text-center">{{form_name}}</h1>

      <b-form @submit="onSubmit" class="text-center">
        <b-form-group
          :id="`input-group-${index}`"
          class="submit-form-group"
          v-for="(question,index) in questionsArray"
          :label="`${question.label}: (${question.type})`"
          label-align="left"
          :label-for="'input-'+`${question.label}`"
          :key="index"
        >
          <b-form-input
            :id="'input-'+`${question.label}`"
            :type="question.type | Lower"
            required
            :placeholder="question.name"
            v-model="question.answer"
          ></b-form-input>
        </b-form-group>

        <b-button id="submit-btn" type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>

    </div>

  </div>
</template>

<script>


  import axios from "axios";

  /**
   * This functions is getting an array of the questions of
   * a specific form by its ID
   * @param url to get the questions from
   * @returns {Promise<{formQuestions: *}>}
   */
  async function getFormQuestions(url)
  {
    let questions;
    await axios
      .get(url)
      .then(response => {
        console.log(response)
        questions = response.data;
        return questions;
      }).catch(response=> {
        console.log("No questions found");
        return null
      })

    return {
      formQuestions: questions
    }
  }

  /**
   * This functions is submitting answers to a specific form by its id
   * @param url to submit the answers to
   * @param form_id the id of the form that is being submitted
   * @param answers the answers of a user for the specific form
   * @returns {Promise<void>}
   */
  async function submitFormAnswers(url, form_id, answers)
  {

    await axios
      .post(url, {
        form_id,
        answers
      })
      .then(response => {
        console.log(response)
      }).catch(error=> {
        console.log("no questions found");
        return error
      });
  }


  export default {
    name: "selectedForm",
    props: {
      form_id: Number,
      form_name: String

    },
    data() {
      return {
        questionsArray: [],
        isLoaded: false,
        isError: false,
        dismissCounter: 4,
      }
    },
    async mounted() {
      // Get the questions
      let formUrl = this.$root.store.baseUrl + "forms/submit/" + this.form_id;
      this.questionsArray = (await getFormQuestions(formUrl)).formQuestions;
      if(!this.questionsArray)
      {
        // Could not found the questions
        this.isError = true;
      }
      else{
        // Append key/value to each question object in the form questions
        this.isLoaded = true;
        console.log("Mounted new questions array")
        this.questionsArray.forEach((question) => {
          question = {
            label: question.label,
            name: question.name,
            type: question.type,
            answer: ""
          }
        })
      }
    },
    methods: {
      countDownChanged(dismissCountDown) {
        this.dismissCounter = dismissCountDown
      },
      closeModal()
      {
        this.$emit('form-na')
      },
      async onSubmit(evt) {
        // Submit the answers to the specific form
        evt.preventDefault()
        // Submit form answers
        let formAnswers = {};
        this.questionsArray.forEach((question) => {
          formAnswers[question.name] = question.answer
        });

        try{
          let url = this.$root.store.baseUrl + "forms/submit";
          await submitFormAnswers(url, this.form_id,formAnswers);
          this.$router.push({name: "Home"}).catch(() => {
            // On Success redirect to the Home page
            this.$router.go();
          });
        }
        catch (error) {
          console.log(error);
        }

        this.$emit('close-panel', "success")
      }
    },
    filters: {
      Lower(value) {
        return value.toLowerCase();
      },
    }
  }
</script>

<style scoped>

  input{
    font-weight: bold;
    outline: none;
    margin: 0;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    width: 80%;
    font-size: 14px;
    font-family: inherit;
    border: 1px solid;
    border-radius: 20px;
    text-align: center;
  }

  .submit-form-group{
    position: relative;
    left: 15%;
    width: 85%;
  }

  #submit-btn{
    margin-right: 10px;
  }
</style>
