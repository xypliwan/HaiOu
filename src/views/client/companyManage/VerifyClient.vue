<template>
  <div>
    <el-dialog title="审核客户" :visible.sync="vierfyVisible" width="600px" :before-close="handleClose">
      <el-row v-loading="formLoading">
        <div class="text">
          <p>请审核以下{{companyList.length}}个客户:</p>
          <span v-for="(item,index) in companyList" :key="index" class="company-name">{{item.company_name}}</span>
        </div>
        <el-form :model="ruleForm" size="small" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="客户状态" prop="company_status">
            <el-select v-model="ruleForm.company_status" filterable clearable placeholder="请选择">
              <el-option v-for="item in statusList" :key="item.status_index" :label="item.status_name" :value="item.status_index" v-if="item.status_index !== '' && item.status_index !== nowStatus"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="客户分组">
            <el-select v-model="ruleForm.group_code" filterable clearable placeholder="请选择">
              <el-option v-for="item in clentGroup" :key="item.group_code" :label="item.group_name" :value="item.group_code"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-row>
      <div class="dialog-footer">
        <el-button size="mini" @click="handleClose">关闭</el-button>
        <el-button size="mini" type="primary" @click="verifyClients">审核</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { verifyClient } from '@/api/client';
export default {
  props: {
    vierfyVisible: {
      type: Boolean,
      default: false
    },
    companyList: [Array], //选择的客户
    clentGroup: [Array], //客户分组
    statusList: [Array], //客户状态
    nowStatus: {
      //当前状态
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formLoading: false,
      ruleForm: {
        company_status: '',
        group_code: ''
      },
      rules: {
        company_status: [{ required: true, message: '请选择需要分配的状态', trigger: 'change' }]
      }
    };
  },
  methods: {
    async verifyClient() {
      this.formLoading = true;
      let companyCode = this.companyList.map(el => el.company_code);
      let params = {
        company_code_array: companyCode,
        company_status: this.ruleForm.company_status,
        group_code: this.ruleForm.group_code
      };
      try {
        let { message } = await verifyClient(params);
        this._message(message, 'success');
        this.$emit('saveOk');
        this.handleClose();
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },

    verifyClients() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.verifyClient();
        } else {
          return false;
        }
      });
    },

    handleClose() {
      this.$refs.ruleForm.resetFields();
      for (let i in this.ruleForm) {
        this.ruleForm[i] = '';
      }
      this.$emit('update:vierfyVisible', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.text {
  margin-bottom: 40px;
  line-height: 24px;
  .company-name {
    background: #f0f4f3;
    padding: 3px 10px;
    margin-right: 7px;
    border-radius: 3px;
    font-size: 12px;
    color: #333;
    display: inline-block;
    margin-top: 7px;
  }
}

/deep/ .el-radio.is-bordered + .el-radio.is-bordered {
  margin-left: 0;
  margin-bottom: 15px;
}
</style>
