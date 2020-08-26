<template>
  <div>
    <div v-if="!isLoaded">
      <b-spinner variant="info"></b-spinner>
    </div>
    <div v-else-if="isError">
      <b-alert :show="dissmissCounter" @dismiss-count-down="countDownChanged" variant="danger" @dismissed="closeModal">
        Could not find the requested form<br>
        Please try again later
      </b-alert>
    </div>
    <div v-else>
      <h1> Form Component </h1>
      <h2>this form is {{form_id}}</h2>

      <b-form @submit="onSubmit" >
        <b-form-group
          id="input-group-1"
          v-for="(question,index) in questionsArray"
          :label="`${question.label}`"
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

        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>

    </div>

  </div>
</template>

<script>


  import axios from "axios";

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
        console.log("no questions found");
        return null
      })

    return {
      formQuestions: questions
    }
  }
  async function submitFormAnswers(form_id, answers)
  {
    let url = "https://heroku-form-builder.herokuapp.com/forms/submit";
    // let url = "http://localhost:3000/forms/submit";
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

    },
    data() {
      return {
        questionsArray: [],
        isLoaded: false,
        isError: false,
        dissmissCounter: 4,
      }
    },
    async mounted() {
      let formUrl = "https://heroku-form-builder.herokuapp.com/forms/submit/" + this.form_id;
      this.questionsArray = (await getFormQuestions(formUrl)).formQuestions;
      if(!this.questionsArray)
      {
        // Should Show error
        this.isError = true;
      }
      else{
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
        this.dissmissCounter = dismissCountDown
      },
      closeModal()
      {
        this.$emit('form-na')
      },
      async onSubmit(evt) {
        evt.preventDefault()
        // Submit form answers
        let answersArray = [];
        this.questionsArray.forEach((question) => {
          answersArray.push({
            qName: question.name,
            qAns: question.answer
          })
        });

        try{
          await submitFormAnswers(this.form_id,answersArray);
          this.$router.push({name: "Home"}).catch(() => {
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
      Upper(value) {
        return value.toUpperCase();
      },

      Lower(value) {
        return value.toLowerCase();
      },
    }
  }
</script>

<style scoped>

</style>
