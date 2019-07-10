<template>
  <div>
    <el-dialog title="分配客服" :visible.sync="distributionListVisible" width="500px" :before-close="handleClose">
      <el-row v-loading="formLoading">
        <div class="text">
          <p>请为以下{{distributionList.length}}条需求分配客服:</p>
          <span v-for="(item,index) in distributionList" :key="index" class="demand-name">{{item}}</span>
        </div>

        <el-form :model="ruleForm" size="small" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="选择客服" prop="user_account">
            <el-select v-model="ruleForm.user_account" filterable clearable placeholder="请选择客服">
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
import { demandAssign } from '@/api/demand';
export default {
  props: {
    distributionListVisible: {
      type: Boolean,
      default: false
    },
    distributionList: {
      //选中的分配的需求
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
        demand_numbers: [], //需求编号
        user_account: '' //用户账号
      },
      rules: {
        user_account: [{ required: true, message: '请选择客服', trigger: 'change' }]
      },
      formLoading: false
    };
  },
  methods: {
    submitService() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.demandAssign();
        } else {
          return false;
        }
      });
    },
    async demandAssign() {
      this.formLoading = true;
      this.ruleForm.demand_numbers = this.distributionList;
      try {
        let { data, message } = await demandAssign(this.ruleForm);
        this.$emit('demandAssignOk');
        this._message(message, 'success');
        this.handleClose();
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },
    handleClose() {
      this.$refs.ruleForm.resetFields();
      this.$emit('update:distributionListVisible', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.text {
  margin-bottom: 40px;
  line-height: 24px;
  .demand-name {
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

