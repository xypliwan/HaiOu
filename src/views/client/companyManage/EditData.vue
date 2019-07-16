<template>
  <div>
    <el-dialog title="编辑资料" :visible.sync="editDialog" width="700px" :before-close="handleClose">
      <div>
        <el-form :model="ruleForm" size="small" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-loading="infoLoading">
          <el-form-item label="公司名称" prop="company_name">
            <el-input v-model="ruleForm.company_name" clearable placeholder="请输入公司名称"></el-input>
          </el-form-item>
          <el-form-item label="公司代码">
            <el-input v-model="ruleForm.company_code" clearable disabled placeholder="请输入公司代码"></el-input>
          </el-form-item>
          <el-form-item label="公司主页" prop="company_web">
            <el-input v-model="ruleForm.company_web" clearable></el-input>
          </el-form-item>
          <!-- <el-form-item label="状态" prop="name">
            <el-radio-group v-model="ruleForm.company_status" size="mini">
              <el-radio :label="item.status_index" border v-for="(item,index) in statusList" v-if="index !== 0" :key="index">{{item.status_name}}</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="客户标签">
            <el-select v-model="ruleForm.company_label" multiple placeholder="请选择(多选)">
              <el-option v-for="item in lableList" :key="item.company_label_id" :label="item.company_label_name" :value="item.company_label_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="ruleForm.company_contacts" clearable placeholder="请输入联系人"></el-input>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="ruleForm.company_telephone" clearable placeholder="请输入联系方式"></el-input>
          </el-form-item>
          <el-form-item label="描述信息">
            <el-input type="textarea" v-model="ruleForm.company_profile" clearable placeholder="请输入描述信息"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button size="mini" @click="handleClose">关 闭</el-button>
        <el-button size="mini" type="primary" @click="saveInfo">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCustomerDetail, editCustomerDetail } from '@/api/client';
export default {
  props: {
    editDialog: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    statusList: {
      type: Array,
      default: () => []
    },
    lableList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      value2: '',
      ruleForm: {
        company_id: '',
        company_name: '',
        company_code: '',
        company_profile: '',
        company_web: '',
        company_label: [],
        company_contacts: '',
        company_telephone: '',
        // company_status: ''
      },
      rules: {
        company_name: [{ required: true, message: '公司名称必填', trigger: 'blur' }],
        company_web: [{ required: true, message: '公司主页必填', trigger: 'blur' }]
      },
      infoLoading: false
    };
  },
  watch: {
    id(newVal) {
      this.getCustomerDetail();
    }
  },
  methods: {
    saveInfo() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.editCustomerDetail();
        } else {
          return false;
        }
      });
    },
    async editCustomerDetail() {
      this.infoLoading = true;
      try {
        let { data, message } = await editCustomerDetail(this.ruleForm);
        this._message(message, 'success');
        this.$emit('editOk');
      } catch (error) {
        this._message(error);
      }
      this.infoLoading = false;
    },
    async getCustomerDetail() {
      this.infoLoading = true;
      try {
        let { data } = await getCustomerDetail({ id: this.id });
        Object.assign(this.ruleForm, data);
      } catch (error) {
        this._message(error);
      }
      this.infoLoading = false;
    },
    handleClose() {
      this.$emit('update:editDialog', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  margin-top: 30px;
  text-align: center;
}
.switch-tip {
  margin-left: 8px;
  position: relative;
  top: 2px;
}
</style>
