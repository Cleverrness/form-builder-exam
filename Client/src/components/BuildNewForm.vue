<template>
  <div class="bg-gra-01 page-wrapper p-t">

    <h3>Add a new Form</h3>
    <h4>Please Add your fields:</h4>
    <div class="inputs">
      <div class="label">
        <!--        <label for="labelTag">Label</label>-->
        <b-form-input autocomplete="off" v-model="fieldLabel" type="text" placeholder="Label" id="labelTag"/>
      </div>
      <div class="name">
        <!--        <label for="nameTag">Name</label>-->
        <b-form-input autocomplete="off" v-model="fieldName" type="text" placeholder="Name" id="nameTag"/>
      </div>
      <div class="type">
        <!--        <label for="typeTag">Type</label>-->
        <b-form-select v-model="selectedType" :options="availableTypes" size="sm" id="typeTag">-->
          <template v-slot:first>
            <b-form-select-option value="null" disabled>-- Please select inpute Type --</b-form-select-option>
          </template>
          <!--          <option v-for="(type,index) in availableTypes" :key="index">{{type}}</option>-->
        </b-form-select>
      </div>
      <b-button class="plus-btn" v-b-popover.hover.top="'Add another field'" variant="secondary" @click="addField" size="md">+</b-button>
    </div>

    <b-table striped hover stacked="md" :fields="fields" :items="questions" class="fields-table" outlined no-border-collapse>
      <template v-slot:cell(delete)="data">
        <b-button variant="link" @click="removeField(data.index)" :key="data.index"><img src="https://img.icons8.com/nolan/20/delete-sign.png"/></b-button>
      </template>
    </b-table>

    <b-container class="buttons-grp">
      <!--Buttons-->
      <b-form-input autocomplete="off" type="text" v-model="formName" placeholder="Name this form" size="sm" id="formName" :class="isDanger"
                    v-b-popover.hover.top=""
      ></b-form-input>

      <b-button pill size="md" variant="danger" @click="cancel" >Cancel</b-button>
      <b-button pill size="md" variant="success" class="add-form-btn" @click="submitNewForm">Add Form</b-button>
    </b-container>

    <b-popover id="formNamePop" :show.sync="showPopOver" target="formName" variant="danger" placement="top" delay="5">
      Please fill form Name!
    </b-popover>
  </div>
</template>

<script>
  import axios from "axios";

  async function submitForm(url, formName, questionsToSubmit) {
    await axios.post(url,{
      name: formName,
      questions: questionsToSubmit
    }).then((response) => {
      console.log(response);
      return response;
    }).catch((error) => {
      console.error(error);
    });
  }

  export default {
    name: "BuildNewForm",
    data() {
      return {
        availableTypes: [
          "Text",
          "Color",
          "Date",
          "Email",
          "Tel",
          "Number"
        ],
        questions: [],
        selectedType: null,
        fieldName: "",
        fieldLabel: "",
        formName: "",
        isDanger: "",
        showPopOver: false,
        fields: [
          {
            key: "label",
            label: "Question Label"
          },
          {
            key: "name",
            label: "Question Name"
          },
          {
            key: "type",
            label: "Question Type"
          },
          {
            key: "delete",
            label: ""
          },
        ]
      }
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    },
    methods: {
      addField() {
        console.log(this.fieldLabel && this.selectedType && this.fieldName)
        if(this.fieldLabel && this.selectedType && this.fieldName)
        {
          this.questions.push({
            label: this.fieldLabel,
            name: this.fieldName,
            type: this.selectedType
          });
          this.resetInputs();
        }
      },
      removeField(fieldIndex)
      {
        console.log(fieldIndex);
        this.questions.splice(fieldIndex,1);
      },
      resetInputs(){
        this.fieldName = "";
        this.fieldLabel = "";
        this.selectedType = null;
      },
      cancel(maxTimeOut) {

        if(!maxTimeOut)
        {
          maxTimeOut = 0;
        }


        setTimeout(() => this.$router.push('/'), maxTimeOut);

      },
      submitNewForm() {
        if(this.questions.length === 0)
        {
          let timeoutBeforeRedirecting = 1500;

          this.$bvToast.toast(`Empty Form. Redirects to home page`, {
            title: 'Error',
            variant: 'danger',
            toaster: 'b-toaster-top-center',
            autoHideDelay: timeoutBeforeRedirecting,
          });

          this.cancel(timeoutBeforeRedirecting);
        }
        else if (!this.formName)
        {
          this.isDanger = "mustFill-red";
          this.showPopOver = true;
        }
        else{
          let url = this.$root.store.baseUrl + "forms/new_form/";

          submitForm(url, this.formName, this.questions).then((response) => {
            console.log(response);
            this.$router.push('/');
          })
        }

      }
    },
    mounted() {
      this.$root.$on('bv::popover::shown', bvEventObj => {
        setTimeout(() => this.$root.$emit('bv::hide::popover', 'formNamePop'), 2000)
      })
    }
  }
</script>

<style scoped>
  * {
    padding: 0;
    margin: 0;
    letter-spacing: 3px;
    font-family: sans-serif;
    /*min-width: 350px;*/
  }

  h4 {
    left: 0;
  }
  .bg-gra-01 {

    background: linear-gradient(to top, #fbc2eb 0%, #a18cd1 100%);
  }

  .page-wrapper {
    padding-top: 20px;
    min-height: 90vh;
    width: 85%;
    left: 0;
    transform: translateX(10%);
    border: 2px white solid;
    border-radius: 20px;
    margin-bottom: 20px;
  }
  input, select{
    outline: none;
    margin: 0;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    width: 80%;
    font-size: 14px;
    font-family: inherit;
    border: 1px solid;
    border-radius: 20px;
  }
  input:focus{
    outline: none;
  }


  @media only screen and (min-width: 300px) {
    .inputs{
      position: relative;
      transform: translateX(10%);

    }

    .plus-btn{
      position: relative;
      transform: translate(-100%, -20%);
    }

    .inputs div {
      position: relative;
      margin: 30px 20px;
    }

    #typeTag{
      margin-right: 130px;
    }

    #formName{
      margin-bottom: 10px;
    }

    .buttons-grp {
      position: relative;
      bottom: 0;
      right: 0;
      padding-bottom: 10px;
      padding-left: 50%;
    }

    .add-form-btn {
      margin-left: 10px;
    }
  }
  @media only screen and (min-width: 768px) {
    .inputs{
      width: 90%;
      position: relative;
      align-items: center;
      justify-content: center;
      display: flex;
      flex-direction: row;

    }

    .inputs div {
      position: relative;
      margin: 30px 0;
    }


    #formName{
      margin-bottom: 10px;
    }

    .buttons-grp {
      position: relative;
      bottom: 0;
      right: 0;
      padding-bottom: 10px;
      padding-left: 50%;
    }

    .add-form-btn {
      margin-left: 10px;
    }
  }
</style>
