<template>
  <div class="open-box">
    <el-dialog title="开通APP" :modal="false" :visible.sync="visibleApp" width="500px" :before-close="handleClose">
      <div>
        <el-form :model="ruleForm" label-width="100px" size="small" class="demo-ruleForm" v-loading="formLoading">
          <el-form-item label="应用编码" prop="name">
            <div>{{application_code}}</div>
          </el-form-item>
          <el-form-item label="系统客户代码" prop="name">
            <div>{{company_code}}</div>
          </el-form-item>
          <el-form-item label="应用客户编码" prop="name">
            <el-input clearable v-model="ruleForm.customer_code"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button size="mini" @click="handleClose">关闭</el-button>
        <el-button size="mini" type="primary" @click="submitApp">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { openApp } from '@/api/client';
export default {
  props: {
    company_code: String,
    application_code: String,
    visibleApp: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    visibleApp() {
      this.ruleForm.customer_code = '';
    }
  },
  data() {
    return {
      ruleForm: { customer_code: '' },
      formLoading: false
    };
  },
  methods: {
    async submitApp() {
      this.formLoading = true;
      let params = {
        application_code: this.application_code,
        company_code: this.company_code,
        customer_code: this.ruleForm.customer_code
      };
      try {
        let { data, message } = await openApp(params);
        this._message(message, 'success');
        this.$parent.$parent.$parent.$parent.getCompanyDetail();
        this.handleClose();
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },
    handleClose() {
      this.$emit('update:visibleApp', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.open-box {
  /deep/ .el-dialog__wrapper {
    z-index: 3000 !important;
  }
  /deep/ .el-dialog {
    z-index: 3000 !important;
  }
}
</style>

