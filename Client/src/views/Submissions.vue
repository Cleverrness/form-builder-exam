<template>
  <div>
    <b-form-select
      v-model="form_id"
      :options="allFormsIds"
      autofocus
      @change="setAnswersOfForm"
      size="md"
      style="width: 30%; align-content: center;">
      <template v-slot:first>
        <b-form-select-option :value="null" disabled>-- Please select a form first --</b-form-select-option>
      </template>
    </b-form-select>

    <div v-show="form_id" class="d-flex justify-center mb-6">
      <b-table :items="answers" style="width: 80%;"></b-table>
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

  async function getForms() {
    let forms = [];
    let forms_id = [];
    // let url = "https://heroku-form-builder.herokuapp.com/forms/submission/" + form_id;
    let url = "http://localhost:3000/forms/all_forms";
    await axios
      .get(url)
      .then(response => {
        console.log(response.data)
        forms = response.data;
        forms.forEach((form) => {
          forms_id.push(form.id)
        })
        return forms_id;
      }).catch(response=> console.log("No answers found"))

    return forms_id
  }


  export default {
    name: "Submissions.vue",
    data() {
      return {
        form_id: this.$route.params.formId ? this.$route.params.formId : null,
        answers: [],
        allFormsIds: []
      }
    },
    async mounted() {
      this.allFormsIds = await getForms();
      if(this.form_id)
      {
        await this.setAnswersOfForm()
      }
    },
    methods: {
      async setAnswersOfForm() {
        const response = await getAnswers(this.form_id);
        console.log("Got the response=")
        this.answers = JSON.parse(JSON.stringify(response))
      }
    }
  }
</script>

<style scoped>

</style>
