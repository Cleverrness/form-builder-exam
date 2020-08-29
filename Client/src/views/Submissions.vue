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
      <h3 v-if="formName !== ''">You are watching <span id="form-name-color">{{formName| Upper}}</span> Submissions</h3>
      <b-table v-if="answers.length > 0" dark striped hover stacked="md" outlined no-border-collapse :items="answers"></b-table>
      <h4 v-else>No Submissions Yet</h4>
    </div>
  </div>
</template>

<script>

  import axios from "axios";

  /**
   * This function is getting the answers of a specific form by its id
   * @param url to get form answers
   * @returns {Promise<Array>}
   * */
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

  /**
   * This function is getting the forms ids to use in the selector at the start of the page
   * @param url to get forms
   * @returns {Promise<Array>}
   */
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
      }).catch(response=> console.log("No forms found"))

    return forms_id
  }

  /**
   * This Function is getting the form name by its ID
   * @param url the url to get form name
   * @returns {Promise<string>}
   */
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
      // Get the list of all forms IDs in the DB
      let url = this.$root.store.baseUrl + "forms/all_forms";
      this.allFormsIds = await getForms(url);
      if(this.form_id || this.form_id === 0)
      {
        await this.setAnswersOfForm()
      }
    },
    methods: {
      async setAnswersOfForm() {
        // Get the form name by its ID
        let nameUrl = this.$root.store.baseUrl + "forms/form_name/" + this.form_id;
        const name = await getFormName(nameUrl);
        console.log("Function Name is = " + name);
        this.formName = name;

        // Get the form answers by its ID
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
    filters: {
      Upper(value) {
        return value.toUpperCase();
      },
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

  #form-name-color{
    background: -webkit-linear-gradient(#3f5efb, #fc466b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
    font-size: 50px;
    padding-left: 10px;
    padding-right: 10px;
  }
</style>
