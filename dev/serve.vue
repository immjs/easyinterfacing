<script lang="ts">
import { defineComponent } from 'vue';
// Uncomment import and local "components" registration if library is not registered globally.
// import { EasyInterfacingSample } from '@/entry.esm';

export default defineComponent({
  name: 'ServeDev',
  // components: {
  //  EasyInterfacingSample,
  // }
});
</script>

<template>
  <div id="app">
    <easy-interfacing-sample />
  </div>
</template>
