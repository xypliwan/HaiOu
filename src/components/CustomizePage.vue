<template>
  <div class="customize-page">
    <el-input size="mini" @keyup.enter.native="goCustomizePage" placeholder="N/页" type="number" :min="1" @input="changeCustomizePage" v-model="customizePage" class="input-with-select">
      <span class="to-page" slot="suffix" @click="goCustomizePage">GO</span>
    </el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      customizePage: null
    };
  },
  methods: {
    changeCustomizePage(e) {
      if (e <= 0) {
        this.customizePage = null;
        return;
      }
    },
    goCustomizePage(){
        if(this.customizePage <= 0 || this.customizePage == null) return;
        this.$emit('customizePage', Number(this.customizePage))
    }
  }
};
</script>

<style lang="scss" scoped>
.customize-page {
  display: inline-block;
  width: 75px;
  .to-page {
    cursor: pointer;
  }
}

// 处理input type = number的上下箭头
/deep/ .el-input__inner::-webkit-outer-spin-button,
/deep/ .el-input__inner::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
/deep/ .el-input__inner[type='number'] {
  -moz-appearance: textfield;
}
</style>
