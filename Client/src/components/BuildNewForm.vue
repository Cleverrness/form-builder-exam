<template>
  <div class="bg-gra-01 page-wrapper p-t">

    <h3>Add a new Form</h3>
    <h4>Please Add your fields:</h4>
    <div class="inputs">
      <div class="label">
<!--        <label for="labelTag">Label</label>-->
        <b-form-input v-model="fieldLabel" type="text" placeholder="Label" id="labelTag"/>
      </div>
      <div class="name">
<!--        <label for="nameTag">Name</label>-->
        <b-form-input v-model="fieldName" type="text" placeholder="Name" id="nameTag"/>
      </div>
      <div class="type">
<!--        <label for="typeTag">Type</label>-->
        <b-form-select v-model="selectedType" :options="availableTypes" size="sm" id="typeTag">-->
<!--          <option v-for="(type,index) in availableTypes" :key="index">{{type}}</option>-->
        </b-form-select>
      </div>
              <b-button class="plus-btn" v-b-popover.hover.top="'Add another field'" variant="outline-secondary" @click="addField" size="md">+</b-button>
    </div>

    <b-table striped hover stacked="md" :items="questions" class="fields-table" outlined no-border-collapse>

    </b-table>

    <b-container class="buttons-grp">
      <!--Buttons-->
      <b-form-input type="text" v-model="formName" placeholder="Name of this form" size="sm" id="formName" :class="isDanger"
                    v-b-popover.hover.top=""
      ></b-form-input>



      <b-button pill size="md" variant="danger" @click="cancel" >Cancel</b-button>
      <b-button pill size="md" variant="success" class="add-btn" @click="submitNewForm">Add Form</b-button>
    </b-container>

    <b-popover id="formNamePop" :show.sync="showPopOver" target="formName" variant="danger" placement="top" delay="5">
      Please fill form Name!
    </b-popover>
  </div>
</template>

<script>
  import axios from "axios";

  async function submitForm(formName, questionsToSubmit) {
    let url = this.$root.store.baseUrl + "forms/new_form/";
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
        showPopOver: false
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
          submitForm(this.formName, this.questions).then((response) => {
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

  .mustFill-red {
    border: 2px solid red;
  }

  .inputs{
    width: 350px;
    /*position: absolute;*/
    /*top: 50%;*/
    /*left: 50%;*/
    /*transform: translate(-50%, -50%);*/
    vertical-align: middle;

  }

  .inputs div {
    position: relative;
    margin: 30px 0;
  }

  .page-wrapper {
    min-height: 100vh;
  }
  .p-t {
    padding-top: 20px;
  }

  #formName{
    margin-bottom: 10px;
    margin-left: 20px;
  }

  .bg-gra-01 {
    background: linear-gradient(to top, #fbc2eb 0%, #a18cd1 100%);
  }

  label {
    position: absolute;
    top: 0;
    /*margin: 10px;*/
    padding: 0 10px;
    transition: top .2s ease-in-out, font-size .2s  ease-in-out;
    color: black;
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

  .naming-row {
    margin-top: 10px;
    margin-bottom: 3px;
  }

  .plus-btn {
    margin-right: 10px;
  }

  .buttons-grp {
    position: fixed;
    bottom: 0;
    right: 0;
    padding-bottom: 10px;
    padding-left: 50%;
    /*margin-top: 50%;*/
    /*margin-left: 38%;*/
  }

  .add-btn {
    margin-left: 10px;
  }

  /*@media only screen and (min-width: 768px) {*/
  /*  .label{*/
  /*    position: absolute;*/
  /*    top: -50%;*/
  /*    left: -80%;*/
  /*    !*transform: translate(-50%, -50%);*!*/
  /*    !*vertical-align: middle;*!*/
  /*  }*/
  /*  #labelTag{*/
  /*    width: 50%;*/
  /*  }*/

  /*  .name{*/
  /*    position: fixed;*/
  /*    top: -100%;*/
  /*    left: -20%;*/
  /*    !*transform: translate(-50%, -50%);*!*/
  /*    !*vertical-align: middle;*!*/
  /*  }*/
  /*  #nameTag{*/
  /*    width: 50%;*/
  /*  }*/

  /*}*/

  /*@media only screen and (min-width: 1024px) {*/
  /*  .label{*/
  /*    position: absolute;*/
  /*    top: -50%;*/
  /*    left: -80%;*/
  /*    !*transform: translate(-50%, -50%);*!*/
  /*    !*vertical-align: middle;*!*/
  /*  }*/
  /*  #labelTag{*/
  /*    width: 80%;*/
  /*  }*/

  /*  .name{*/
  /*    position: fixed;*/
  /*    top: -100%;*/
  /*    left: -20%;*/
  /*    !*transform: translate(-50%, -50%);*!*/
  /*    !*vertical-align: middle;*!*/
  /*  }*/
  /*  #nameTag{*/
  /*    width: 50%;*/
  /*  }*/

  /*}*/
</style>
