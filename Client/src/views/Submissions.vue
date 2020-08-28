<template>
  <div class="centered">
    <b-form-select
      v-model="form_id"
      :options="allFormsIds"
      autofocus
      @change="setAnswersOfForm"
      size="md"
      class="select">
      <template v-slot:first>
        <b-form-select-option :value="null" disabled>-- Please select a form first --</b-form-select-option>
      </template>
    </b-form-select>
    <div v-if="form_id != null && form_id >= 0" >
      <h3>{{heading}}</h3>
      <b-table v-if="answers.length > 0" striped hover stacked="md" outlined no-border-collapse :items="answers"></b-table>
      <h4 v-else>No Submissions Yet</h4>
    </div>
  </div>
</template>

<script>

  import axios from "axios";

  async function getAnswers(url) {
    let answers;

    await axios
      .get(url)
      .then(response => {
        console.log(response.data)
        answers = response.data;
        return answers;
      }).catch(response=> {
        console.log("No answers found");
        return null;
      })

    return answers
  }

  async function getForms(url) {
    let forms = [];
    let forms_id = [];

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

  async function getFormName(url) {
    let name = "";

    await axios
      .get(url)
      .then(response => {
        console.log("name is = " + JSON.stringify(response.data))
        name = response.data;
        return name;
      }).catch(response=> console.log("This form does not exists"))

    return name;
  }


  export default {
    name: "Submissions.vue",
    data() {
      return {
        form_id: this.$route.params.formId ? this.$route.params.formId : null,
        answers: [],
        allFormsIds: [],
        formName: "",
      }
    },
    async mounted() {
      let url = this.$root.store.baseUrl + "forms/all_forms";
      this.allFormsIds = await getForms(url);
      if(this.form_id || this.form_id === 0)
      {
        await this.setAnswersOfForm()
      }
    },
    methods: {
      async setAnswersOfForm() {
        let nameUrl = this.$root.store.baseUrl + "forms/form_name/" + this.form_id;
        const name = await getFormName(nameUrl);
        console.log("Function Name is = " + name);
        this.formName = name;

        let url = this.$root.store.baseUrl + "forms/submission/" + this.form_id;
        const response = await getAnswers(url);
        if(!response)
        {
          this.answers = [];
        }
        else{
          console.log("Got the response=")
          this.answers = JSON.parse(JSON.stringify(response))
        }

      }
    },
    computed: {
      heading() {
        if (this.formName !== "")
        {
          return "You are watching " + this.formName.toUpperCase() + " Submissions"
        }
        return ""
      }
    }
  }
</script>

<style scoped>
  .centered {
    width: 85%;
    left: 0;
    transform: translateX(10%);
  }
  .select {
    width: 30%;
    margin-bottom: 20px;
  }
</style>
