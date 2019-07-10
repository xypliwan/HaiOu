<template>
  <div>
    <el-dialog title="分配客服" :visible.sync="companyVisible" width="500px" :before-close="handleClose">
      <el-row v-loading="formLoading">
        <div class="text">
          <p>请为以下{{companyList.length}}个公司分配客服:</p>
          <span v-for="(item,index) in companyList" :key="index" class="company-name">{{item.company_name}}</span>
        </div>
        <el-form :model="ruleForm" size="small" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="销售代表" prop="sales">
            <el-select v-model="ruleForm.sales" filterable clearable placeholder="请选择客服">
              <el-option v-for="item in customerService" :key="item.admin_account" :label="item.admin_name" :value="item.admin_account"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客服代表" prop="service">
            <el-select v-model="ruleForm.service" filterable clearable placeholder="请选择客服">
              <el-option v-for="item in customerService" :key="item.admin_account" :label="item.admin_name" :value="item.admin_account"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="技术支持" prop="technical">
            <el-select v-model="ruleForm.technical" filterable clearable placeholder="请选择客服">
              <el-option v-for="item in customerService" :key="item.admin_account" :label="item.admin_name" :value="item.admin_account"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-row>
      <div class="dialog-footer">
        <el-button size="mini" @click="handleClose">关闭</el-button>
        <el-button size="mini" type="primary" @click="submitService">分配</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { assignStaff } from '@/api/client';
export default {
  props: {
    companyVisible: {
      type: Boolean,
      default: false
    },
    companyList: {
      //选中的公司列表
      type: Array,
      default: () => []
    },
    customerService: {
      //客服列表
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectService: [],
      ruleForm: {
        sales: '', //销售代表
        service: '', //客服代表
        technical: '', //技术支持
        company_code_arr: [] //公司code
      },
      rules: {
        sales: [{ required: true, message: '请选择销售代表', trigger: 'change' }],
        service: [{ required: true, message: '请选择客服代表', trigger: 'change' }],
        technical: [{ required: true, message: '请选择技术支持', trigger: 'change' }]
      },
      formLoading: false
    };
  },
  methods: {
    submitService() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.assignStaff();
        } else {
          return false;
        }
      });
    },
    async assignStaff() {
      this.formLoading = true;
      this.ruleForm.company_code_arr = this.companyList.map(el => el.company_code);
      try {
        let { data, message } = await assignStaff(this.ruleForm);
        this.$emit('assignStaffOk');
        this._message(message, 'success');
        this.handleClose();
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },
    handleClose() {
      this.$refs.ruleForm.resetFields();
      this.$emit('update:companyVisible', false);
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
</style>

