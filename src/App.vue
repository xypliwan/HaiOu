<template>
  <div id="app">
    <keep-alive v-if="$route.meta.keepAlive">
      <router-view></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
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