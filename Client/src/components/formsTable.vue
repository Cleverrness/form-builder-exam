<template>
  <div>
    <b-table striped hover :items="allForms" >
      <template v-slot:cell(LinkToSubmit)="data">
        <a :href="data.item.LinkToSubmit">Submit to this form</a>
      </template>
      <template v-slot:cell(LinkToSubmission)="data">
        <a :href="data.item.LinkToSubmission">View all Submissions of this form</a>
      </template>
    </b-table>
  </div>
</template>

<script>
  import axios from 'axios';

  async function getForms(url) {
    let forms
    await axios
      .get(url)
      .then(response => {
        console.log(response)
        forms = response.data;
        return forms;
      }).catch(response=> console.log("no recipes"))

    return {
      recivedForms: forms
    }
  }
  export default {
    name: "formsTable",
    props: {
      url: {
        type: String,
        required: true
      },
    },
    data() {
      return {
        fields: [
          {
            // A column that needs custom formatting,
            // calling formatter 'fullName' in this app
            key: 'LinkToSubmit',
            label: 'Submit',
            formatter: 'fullName'
          },
          {
            // A regular column with custom formatter
            key: 'LinkToSubmission',
          },
          {
            // A virtual column with custom formatter
            key: 'birthYear',
            label: 'Calculated Birth Year',
            formatter: (value, key, item) => {
              return new Date().getFullYear() - item.age
            }
          }
        ],
        allForms: []
      }
    },
    methods: {
      async updateTable(){
        console.log("Entered updateTable()");
        const {recivedForms} = await getForms(this.url);
        this.allForms = recivedForms;
      }
    },
    mounted() {
      this.updateTable();
    }

  }
</script>

<style scoped>

</style>
