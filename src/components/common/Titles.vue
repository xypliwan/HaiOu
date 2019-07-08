<template>
  <div class="titles">
    <div class="line fl">
      <span></span>
    </div>

    <div class="texts fl">{{titles}}</div>
  </div>
</template>

<script>
export default {
  props: {
    titles: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.titles {
  height: 50px;
  font-size: 18px;
  color: #333;
  .line {
    width: 3px;
    margin-right: 10px;
    display: inline-block;
    line-height: 30px;
    span {
      height: 20px;
      background: #007947;
      padding: 2px;
      border-radius: 1px;
      display: inline-block;
      margin-top: 5px;
    }
  }
  .texts {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
  }
}
</style>
