<template>
  <div class="home">
    <formsTable :url="urlToGetForms" class="form-table"/>
  </div>
</template>

<script>
// @ is an alias to /src
import formsTable from '@/components/formsTable.vue'

export default {
  name: 'Home',
  data() {
    return {
      urlToGetForms: "https://heroku-form-builder.herokuapp.com/forms/all_forms"
    };
  },
  components: {
    formsTable
  }
}
</script>

<style>
  .home{
    width: 85%;
    left: 0;
    transform: translateX(10%);
  }
  .form-table{

  }
</style>
