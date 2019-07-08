<template>
  <div>
    <el-dialog title="审核合同" :visible.sync="reviewVisible" width="600px" :before-close="handleClose">
      <div>请审核以下{{selectTemplate.length}}条合同编号</div>
      <div class="reviewbg-wrapper">
        <span class="reviewbg" v-for="(item,index) in selectTemplate" :key="index">{{item}}</span>
      </div>

      <div class="dialog-footer">
        <el-button size="mini" @click="reviewContract(2)">不通过</el-button>
        <el-button size="mini" type="primary" @click="reviewContract(3)">通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { reviewContract } from '@/api/system';
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
    async reviewContract(status) {
      //审核合同
      let params = {
        doc_number_arr: this.selectTemplate,
        doc_status: status
      };
      const loading = this.$loading({
        lock: true,
        text: 'loading...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      });
      try {
        let { message } = await reviewContract(params);
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

