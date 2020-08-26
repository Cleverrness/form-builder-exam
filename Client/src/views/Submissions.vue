<template>
  <div>
    <div v-show="form_id">
      <b-table :items="answers"></b-table>
    </div>
    <div v-show="!form_id">
      <h3> Please select a form first</h3>
    </div>
  </div>
</template>

<script>

  import axios from "axios";

  async function getAnswers(form_id) {
    let answers;
    // let url = "https://heroku-form-builder.herokuapp.com/forms/submission/" + form_id;
    let url = "http://localhost:3000/forms/submission/" + form_id;
    await axios
      .get(url)
      .then(response => {
        console.log(response.data)
        answers = response.data;
        return answers;
      }).catch(response=> console.log("No answers found"))

    return answers
  }

  export default {
    name: "Submissions.vue",
    data() {
      return {
        form_id: this.$route.params.formId,
        answers: []
      }
    },
    async mounted() {
      if(this.form_id)
      {
        const response = await getAnswers(this.form_id);
        console.log("Got the response=")
        this.answers = JSON.parse(JSON.stringify(response))
      }
    }
  }
</script>

<style scoped>

</style>
