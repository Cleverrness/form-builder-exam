<template>
  <div>

    <div v-if="!allForms">
      <b-spinner variant="info"></b-spinner>
    </div>

    <!--Forms table showing all forms from the DB -->
    <!--TODO: create component inorder to decide which table to use, stacked table or stick-header-->
    <b-table striped hover :items="allForms" responsive outlined no-border-collapse>
      <template v-slot:cell(LinkToSubmit)="data">
        <b-button variant="link" @click="openSubmitForm(data.item.id)" :key="data.item.id">Submit to this form</b-button>
      </template>
      <template v-slot:cell(LinkToSubmission)="data">
        <b-button variant="link" @click="showSubmissions(data.item.id)" :key="data.item.id">View all Submissions of this form</b-button>
      </template>
    </b-table>

    <!--Submission Modal -->
    <!--TODO: maybe change to page-->
    <b-modal v-model="showSubmissionModal" hide-footer title="Using Component Methods">

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
        <selected-form @form-na="closeModal" @close-panel="closeModal" :form_id="selectedFormId">Hello From Submit Modal!</selected-form>
      </div>
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
        this.selectedFormId = id;
        this.showSubmitModal = true;
      },
      closeModal()
      {
        this.showSubmitModal = false;
      },
      showSubmissions(selected_form_id)
      {
        this.$router.push('/Submissions/'+selected_form_id);
      }
    },
    mounted() {
      this.updateTable();
      console.log("windows size = " + JSON.stringify(window.innerWidth));
      window.addEventListener('resize', this.handleResize);
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

  .bg-gra-01 {
    background: -webkit-gradient(linear, left bottom, left top, from(#fbc2eb), to(#a18cd1));
    background: -webkit-linear-gradient(bottom, #fbc2eb 0%, #a18cd1 100%);
    background: -moz-linear-gradient(bottom, #fbc2eb 0%, #a18cd1 100%);
    background: -o-linear-gradient(bottom, #fbc2eb 0%, #a18cd1 100%);
    background: linear-gradient(to top, #fbc2eb 0%, #a18cd1 100%);
  }
</style>
