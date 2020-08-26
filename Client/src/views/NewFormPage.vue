<template>
  <div class="form-page">
    <new-form></new-form>
  </div>
</template>

<script>
  import newForm from '@/components/BuildNewForm.vue';
    export default {
        name: "NewFormPage",
      components: {
        newForm
      }
    }
</script>

<style scoped>

</style>
