<template>
  <div class="home">
    <formsTable :url="urlToGetForms"/>
  </div>
</template>

<script>
import formsTable from '@/components/formsTable.vue'

export default {
  name: 'Home',
  data() {
    return {
      urlToGetForms: this.$root.store.baseUrl + "forms/all_forms"
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
</style>
