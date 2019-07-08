<template>
  <div>
    <el-dialog title="审核合同模板" :visible.sync="reviewVisible" width="600px" :before-close="handleClose">
      <div>请审核以下{{selectTemplate.length}}条合同模板编码</div>
      <div class="reviewbg-wrapper">
        <span class="reviewbg" v-for="(item,index) in selectTemplate" :key="index">{{item}}</span>
      </div>

      <div class="dialog-footer">
        <el-button size="mini" @click="submitReviewTemplate(2)">不通过</el-button>
        <el-button size="mini" type="primary" @click="submitReviewTemplate(3)">通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { reviewTemplate } from '@/api/system';
export default {
  props: {
    reviewVisible: {
      type: Boolean,
      default: false
    },
    selectTemplate: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    async submitReviewTemplate(status) {
      //审核模板
      let params = {
        template_no_arr: this.selectTemplate,
        template_status: status
      };
      const loading = this.$loading({
        lock: true,
        text: 'loading...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      });
      try {
        let { message } = await reviewTemplate(params);
        this._message(message, 'success');
        this.handleClose();
        this.$emit('reviewOk');
      } catch (error) {
        this._message(error);
      }
      loading.close();
    },
    handleClose() {
      this.$emit('update:reviewVisible', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.reviewbg-wrapper {
  padding: 10px 0;
}
.reviewbg {
  background: #f0f4f3;
  padding: 3px 10px;
  margin-right: 8px;
  border-radius: 3px;
  font-size: 12px;
  color: #333;
  display: inline-block;
  margin-bottom: 10px;
}
</style>

