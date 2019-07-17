<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'App',
  watch: {
    $route(newVal, oldVal) {
      if (newVal.name == '404') return;
      if (newVal.meta.authentication) {
        if (newVal.meta.name == 'label-list') return;
        this.addTablist(newVal.meta);
      }
    }

  },
  

  methods: {
    ...mapActions(['addTablist'])
  }
};
</script>