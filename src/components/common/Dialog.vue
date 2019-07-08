<template>
  <div class="dialog" @click="close" :class="{ 'active-bg': showDialog }">
    <div @click.stop class="content" :style="{ width: width }" :class="{ 'active-show': showDialog }">
      <div class="dialog-title">
        {{ title }}
        <i class="iconfont icon-guanbi" @click="close"></i>
      </div>
      <div class="slot-cont">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: [Number, String],
      default: 500
    },
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showDialog: false
    };
  },
  watch: {
    show(newVal) {
      this.showDialog = newVal;
    }
  },
  methods: {
    close() {
      this.$emit('update:show', false);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '_a/styles/global.scss';
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 99;
  background: rgba($color: #000000, $alpha: 0.5);
  @include transitons(0.2s);
  opacity: 0;
  left: 0;
  visibility: hidden;
  &.active-bg {
    opacity: 1;
    visibility: visible;
  }
  .content {
    @include transitons(0.1s);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    overflow: hidden;
    transform: translateX(100%);
    padding: 20px 20px;
    &.active-show {
      transform: translateX(0%);
    }
    .dialog-title {
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      color: #666;
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      padding: 0px 20px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

      .iconfont {
        font-size: 18px;
        float: right;
        margin-right: 20px;
        cursor: pointer;
      }
    }
    .slot-cont {
      position: absolute;
      top: 52px;
      right: 0;
      bottom: 0;
      background: #fff;
      overflow-y: auto;
      padding: 20px 0;
      width: 100%;
    }
  }
}
</style>
