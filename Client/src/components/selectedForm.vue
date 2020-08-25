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
      <p v-for="(question,index) in questionsArray" :key="index">{{question.label}}, {{question.name}}, {{question.type}}</p>
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
            dissmissCounter: 4
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
        this.isLoaded = true;
      },
      methods: {
        countDownChanged(dismissCountDown) {
          this.dissmissCounter = dismissCountDown
        },
        closeModal()
        {
          this.$emit('form-na')
        }
      }
    }
</script>

<style scoped>

</style>
