<template>
  <div>

    <div v-if="!allForms">
      <b-spinner variant="info"></b-spinner>
    </div>
    <div v-else-if="allForms.length === 0">
      <h2>There are no forms yet</h2>
      <h4>Please add one using the 'Add New Form' page.</h4>
    </div>

    <!--Forms table showing all forms from the DB -->
    <!--TODO: create component inorder to decide which table to use, stacked table or stick-header-->
    <b-table dark striped hover :items="allForms" :fields="fields" stacked="md" outlined no-border-collapse>
      <template v-slot:cell(LinkToSubmit)="data">
        <b-button variant="link" @click="openSubmitForm(data.item.id, data.item.name)" :key="data.item.id">Submit to this form</b-button>
      </template>
      <template v-slot:cell(LinkToSubmission)="data">
        <router-link :to="`/Submissions/${data.item.id}`">
          <b-button variant="link" :key="data.item.id">View all Submissions of this form</b-button>
        </router-link>
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
             content-class="submitting-page"
             header-class="p-2 border-bottom-0"
             button-size="sm"
             >
      <div >
        <selected-form @form-na="closeModal" @close-panel="closeModal" :form_name="selectedFormName" :form_id="selectedFormId">Hello From Submit Modal!</selected-form>
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
            key: 'id',
            label: 'ID',
          },
          {
            key: 'name',
            label: 'Form Name',
          },
          {
            key: 'numOfSubmissions',
            label: '# Submitted Answers',
          },
          {
            key: 'LinkToSubmit',
            label: 'Submit',
          },
          {
            key: 'LinkToSubmission',
            label: 'Submissions'
          }
        ],
        allForms: null,
        showSubmissionModal: false,
        showSubmitModal: false,
        selectedFormId: null,
        selectedFormName: "",
        showAddFormModal: false
      }
    },
    methods: {
      async updateTable(){
        console.log("Entered updateTable()");
        const {recivedForms} = await getForms(this.url);
        this.allForms = recivedForms;
      },
      async openSubmitForm(id, name)
      {
        this.selectedFormId = id;
        this.selectedFormName = name;
        this.showSubmitModal = true;
      },
      closeModal()
      {
        this.showSubmitModal = false;
      },
      // showSubmissions(selected_form_id)
      // {
      //   this.$router.push('/Submissions/'+selected_form_id);
      // }
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

  /deep/ .submitting-page {
    background: linear-gradient(to top, #fbc2eb 0%, #a18cd1 100%);
  }

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
