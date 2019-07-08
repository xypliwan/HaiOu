<template>
  <div>
    <el-dialog :visible.sync="urlViewVisible" width="1200px" :before-close="handleClose">
      <div> 
          <iframe :src="url" width="100%" height="500" frameborder="0" scrolling="auto"></iframe>
      </div>
      <div class="dialog-footer">
        <el-button size="mini" @click="handleClose">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    urlViewVisible: {
      type: Boolean,
      default: false
    },
    url:{
       type: String,
      default: '' 
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:urlViewVisible', false);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
