<template>
  <div class="table-tabs">
    <span class="tab" v-for="(item, index) in operatType" :key="index" @click="handleTab(item,index)">
      <span v-show="index!=0">
        <el-divider direction="vertical"></el-divider>
      </span>
      <span :class="{avtive: currentIndex==index}">
        <label v-if="idDev">{{item.index}}</label>
        {{item.name}}
        <span>{{item.count}}</span>
      </span>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    operatType: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentIndex: 0
    };
  },
  watch: {},
  methods: {
    handleTab(item, index) {
      this.currentIndex = index;
      this.$emit('getStatus', item.index);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.table-tabs {
  padding-left: 10px;
  height: 50px;
  line-height: 50px;
  font-size: 13px;
  color: #666;
  border-bottom: 1px solid #e7eaef;
  box-sizing: border-box;
  background-color: #fff;
  .tab > span {
    display: inline-block;
    height: 50px;
    padding: 0 10px;
    cursor: pointer;
    span {
      color: #666;
    }
  }
  .avtive {
    box-shadow: #13a468 0px -2px 0px 0px inset;
    color: #13a468;
  }
}
</style>

