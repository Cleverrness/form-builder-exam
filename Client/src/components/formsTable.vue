<template>
  <div>
    <!--Button for creating new form -->
    <b-button block pill variant="info" sticky-header class="new-form-btn" @click="showAddFormModal = !showAddFormModal">Add new form</b-button>

    <!--Forms table showing all forms from the DB -->
    <b-table striped hover stacked="md" :items="allForms" outlined no-border-collapse>
      <template v-slot:cell(LinkToSubmit)="data">
        <b-button variant="link" @click="openSubmitForm(data.item.id)" :key="data.item.id">Submit to this form</b-button>
      </template>
      <template v-slot:cell(LinkToSubmission)="data">
        <b-button variant="link" @click="showSubmissionModal = !showSubmissionModal" :key="data.item.id">View all Submissions of this form</b-button>
      </template>
    </b-table>

    <!--Submission Modal -->
    <!--TODO: maybe change to page-->
    <b-modal v-model="showSubmissionModal" hide-footer title="Using Component Methods">
      <div class="d-block text-center">
        <h3>Hello From Submission Modal!</h3>
      </div>
      <b-button class="mt-3" variant="outline-danger" block @click="showSubmissionModal = !showSubmissionModal">Close Me</b-button>
    </b-modal>

    <!--Submit Modal -->
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
    </b-modal>

    <b-modal
    hide-header
    lazy
    align="left"
    v-model="showAddFormModal"
    >
    <new-form></new-form>
    </b-modal>


  </div>
</template>

<script>
  import axios from 'axios';
  import selectedForm from '@/components/selectedForm.vue';
  import newForm from '@/components/BuildNewForm.vue';

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
        showAddFormModal: false
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
      selectedForm,
      newForm
    }

  }
</script>

<style scoped>
  .new-form-btn {
    margin-bottom: 10px;
  }
</style>
