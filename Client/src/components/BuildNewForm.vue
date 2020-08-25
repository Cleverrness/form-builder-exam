<template>
  <div>
    <h1>Build new Form</h1>
    <b-row>
      <!--Titles-->
      <b-col sm="2">Label:</b-col>
      <b-col sm="2">Name:</b-col>
      <b-col sm="2">Type:</b-col>
    </b-row>
    <b-row>
      <!--Inputs-->
      <b-col>
        <b-form-input type="text"></b-form-input>
      </b-col>
      <b-col>
        <b-form-input type="text"></b-form-input>
      </b-col>
      <b-col>
        <b-form-select :options="availableTypes" class="mb-1"></b-form-select>
      </b-col>
    </b-row>
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
            questions: []
          }
      },
      filters: {
        capitalize: function (value) {
          if (!value) return ''
          value = value.toString()
          return value.charAt(0).toUpperCase() + value.slice(1)
        }
      }
    }
</script>

<style scoped>

</style>
