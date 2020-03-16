<template>
  <VApp>
    <VAppBar app color="primary" dark>
      <div class="d-flex align-center" />
      <VCard class="pa-2">Certain Lending Interview Project</VCard>
      <VSpacer />
      <VCard class="pa-2">Joao Foltran</VCard>
    </VAppBar>
    <!-- VContent is the view that will render the component specified in router/index.js -->
    <VContent>
      <router-view />
    </VContent>
  </VApp>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  })
};
</script>
