<template>
  <div class="my-cntnr bg-gra-01 page-wrapper p-t">

    <h3>Add a new Form</h3>

    <b-container>
      <b-row class="naming-row">
        <b-col id="label" aria-invalid="true">Label:</b-col>
        <b-col id="name">Name:</b-col>
        <b-col id="type">Type:</b-col>
      </b-row>
      <b-row align-h="around">
        <b-col>
          <b-form-input v-model="fieldLabel" type="text"></b-form-input>
        </b-col>
        <b-col>
          <b-form-input v-model="fieldName" type="text"></b-form-input>
        </b-col>
        <b-col>
          <b-form-select v-model="selectedType" :options="availableTypes" class="mb-1"></b-form-select>
        </b-col>
        <b-button class="plus-btn" v-b-popover.hover.top="'Add another field'" variant="outline-secondary" @click="addField" size="md">+</b-button>

      </b-row>
    </b-container>

<!--    <b-container>-->
<!--      <b-row v-for="(question,index) in questions" :key="index">-->
<!--        <b-col>{{question.label}}</b-col>-->
<!--        <b-col>{{question.name}}</b-col>-->
<!--        <b-col>{{question.type}}</b-col>-->
<!--      </b-row>-->
<!--    </b-container>-->
    <b-table striped hover stacked="md" :items="questions" outlined no-border-collapse>

    </b-table>

    <b-container class="buttons-grp">
      <!--Buttons-->
      <b-button pill size="md" variant="danger" >Cancel</b-button>
      <b-button pill size="md" variant="success" class="add-btn">Add Form</b-button>
    </b-container>
  </div>
</template>

<script>
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
            fieldLabel: ""
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
        }
      }
    }
</script>

<style scoped>
  html {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  * {
    padding: 0;
    margin: 0;
  }


  *, *:before, *:after {
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
    box-sizing: inherit;
  }


  .page-wrapper {
    min-height: 100vh;
  }
  .p-t {
    padding-top: 20px;
  }

  .bg-gra-01 {
    background: -webkit-gradient(linear, left bottom, left top, from(#fbc2eb), to(#a18cd1));
    background: -webkit-linear-gradient(bottom, #fbc2eb 0%, #a18cd1 100%);
    background: -moz-linear-gradient(bottom, #fbc2eb 0%, #a18cd1 100%);
    background: -o-linear-gradient(bottom, #fbc2eb 0%, #a18cd1 100%);
    background: linear-gradient(to top, #fbc2eb 0%, #a18cd1 100%);
  }


  input {
    outline: none;
    margin: 0;
    border: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    width: 100%;
    font-size: 14px;
    font-family: inherit;
  }

  .naming-row {
    margin-top: 10px;
    margin-bottom: 3px;
  }

  #label {
    padding: 0;
    font-weight: bold;
    transform: translateX(-18%);
  }
  #name {
    padding: 0;
    font-weight: bold;
    transform: translateX(-32%);
  }
  #type {
    padding: 0;
    font-weight: bold;
    transform: translateX(-48%);
  }

  .plus-btn {
    margin-right: 10px;
  }

  .buttons-grp {
    position: absolute;
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
</style>
