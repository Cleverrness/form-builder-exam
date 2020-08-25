<template>
  <div >
    <b-table striped hover :items="allForms">
      <template v-slot:cell(LinkToSubmit)="data">
        <b-button variant="link" @click="openSubmitForm(data.item.id)" :key="data.item.id">Submit to this form</b-button>
      </template>
      <template v-slot:cell(LinkToSubmission)="data">
        <b-button variant="link" @click="showSubmissionModal = !showSubmissionModal" :key="data.item.id">View all Submissions of this form</b-button>
      </template>
    </b-table>
    <b-modal v-model="showSubmissionModal" hide-footer title="Using Component Methods">
      <div class="d-block text-center">
        <h3>Hello From Submission Modal!</h3>
      </div>
      <b-button class="mt-3" variant="outline-danger" block @click="showSubmissionModal = !showSubmissionModal">Close Me</b-button>
    </b-modal>

    <b-modal v-model="showSubmitModal"
             scrollable
             centered
             no-close-on-backdrop
             hide-footer
             button-size="sm"
             title="Submit the form">
      <div class="d-block text-center" >
        <selected-form @form-na="closeModal" :form_id="selectedFormId">Hello From Submit Modal!</selected-form>
      </div>
<!--      <b-button class="mt-3" variant="outline-danger" block @click="showSubmitModal = !showSubmitModal">Close Me</b-button>-->
    </b-modal>
  </div>
</template>

<script>
  import axios from 'axios';
  import selectedForm from '@/components/selectedForm.vue';

  async function getForms(url) {
    let forms
    await axios
      .get(url)
      .then(response => {
        console.log(response)
        forms = response.data;
        return forms;
      }).catch(response=> console.log("no forms found"))

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
            key: 'LinkToSubmit',
            label: 'Submit',
            formatter: 'fullName'
          },
          {
            key: 'LinkToSubmission',
            label: 'Submission'
          }
        ],
        allForms: [],
        showSubmissionModal: false,
        showSubmitModal: false,
        selectedFormId: null,
      }
    },
    methods: {
      async updateTable(){
        console.log("Entered updateTable()");
        const {recivedForms} = await getForms(this.url);
        this.allForms = recivedForms;
      },
      async openSubmitForm(id)
      {
        console.log(id);
        this.selectedFormId = id;
        this.showSubmitModal = true;
      },
      closeModal()
      {
        this.showSubmitModal = false;
      }
    },
    mounted() {
      this.updateTable();
    },
    components: {
      selectedForm
    }

  }
</script>

<style scoped>

</style>
