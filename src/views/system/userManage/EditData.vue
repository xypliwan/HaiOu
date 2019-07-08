<template>
  <div>
    <el-dialog :title="detailTitle" :visible.sync="editDialog" width="600px" :before-close="handleClose">
      <div>
        <el-form :model="ruleForm" size="small" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-loading="detailLoading">
          <el-form-item label="用户账户" prop="user_account">
            <el-input v-if="flg !== '2'" :disabled="flg !== '1'" v-model="ruleForm.user_account" clearable placeholder="请输入用户账户"></el-input>
            <span v-else>{{ruleForm.user_account}}</span>
          </el-form-item>
          <el-form-item label="用户中文名" prop="user_name">
            <el-input v-if="flg !== '2'" v-model="ruleForm.user_name" clearable placeholder="请输入用户中文名"></el-input>
            <span v-else>{{ruleForm.user_name}}</span>
          </el-form-item>
          <el-form-item label="用户英文名" prop="user_name_en">
            <el-input v-if="flg !== '2'" v-model="ruleForm.user_name_en" clearable placeholder="请输入用户英文名"></el-input>
            <span v-else>{{ruleForm.user_name_en}}</span>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="user_email">
            <el-input v-if="flg !== '2'" v-model="ruleForm.user_email" clearable placeholder="请输入用户邮箱"></el-input>
            <span v-else>{{ruleForm.user_email}}</span>
          </el-form-item>
          <el-form-item label="用户昵称">
            <el-input v-if="flg !== '2'" v-model="ruleForm.nick_name" clearable placeholder="请输入用户昵称"></el-input>
            <span v-else>{{ruleForm.nick_name}}</span>
          </el-form-item>
          <el-form-item label="QQ号码">
            <el-input v-if="flg !== '2'" v-model="ruleForm.qq_number" clearable placeholder="请输入QQ号码"></el-input>
            <span v-else>{{ruleForm.qq_number}}</span>
          </el-form-item>
          <el-form-item label="入职日期">
            <el-date-picker v-if="flg !== '2'" v-model="ruleForm.join_date" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
            <span v-else>{{ruleForm.join_date}}</span>
          </el-form-item>
          <el-form-item label="离职日期">
            <el-date-picker v-if="flg !== '2'" v-model="ruleForm.leave_date" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
            <span v-else>{{ruleForm.leave_date}}</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button size="mini" @click="handleClose">关 闭</el-button>
        <el-button size="mini" type="primary" v-show="flg !== '2'" @click="submitUser">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addStaff, getStaffDetail, editStaff } from '@/api/system';
export default {
  props: {
    editDialog: {
      type: Boolean,
      default: false
    },
    adminAccount: {
      type: String,
      default: ''
    },
    flg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      value2: '',
      ruleForm: {
        user_account: '', //用户账户
        user_name: '', //用户中文名
        user_name_en: '', //用户英文名
        user_email: '', //用户邮箱
        nick_name: '', //用户昵称
        qq_number: '', //QQ号码
        join_date: '', //入职日期
        leave_date: '', //离职日期
        user_password: '123456' //默认密码
      },
      rules: {
        user_account: [{ required: true, message: '请输入用户账户', trigger: 'blur' }],
        user_name: [{ required: true, message: '请输入用户中文名', trigger: 'blur' }],
        user_name_en: [{ required: true, message: '请输入用户英文名', trigger: 'blur' }],
        user_email: [{ required: true, message: '请输入用户邮箱', trigger: 'blur' }]
      },
      detailTitle: '新增用户',
      detailLoading: false
    };
  },
  watch: {
    flg(newVal) {
      if (newVal) {
        switch (newVal) {
          case '1': //新增
            this.detailTitle = '新增用户';
            for (let i in this.ruleForm) {
              this.ruleForm[i] = '';
            }
            break;
          case '2': //查看
            this.detailTitle = '查看用户';
            this.getStaffDetail(this.adminAccount);
            break;
          case '3': //编辑
            this.detailTitle = '编辑用户';
            this.getStaffDetail(this.adminAccount);
            break;
        }
      }
    }
  },
  methods: {
    async editStaff() {
      this.detailLoading = true;
      try {
        let { message } = await editStaff(this.ruleForm);
        this._message(message, 'success');
        this.reset();
        this.handleClose();
        this.$emit('saveOk');
      } catch (error) {
        this._message(error);
      }
      this.detailLoading = false;
    },
    async getStaffDetail(account) {
      //获取员工详情
      this.detailLoading = true;
      try {
        let { data } = await getStaffDetail({ user_account: account });
        Object.assign(this.ruleForm, data);
      } catch (error) {
        this._message(error);
      }
      this.detailLoading = false;
    },
    async addStaff() {
      this.detailLoading = true;
      try {
        let { message } = await addStaff(this.ruleForm);
        this._message(message, 'success');
        this.$emit('saveOk');
        this.handleClose();
      } catch (error) {
        this._message(error);
      }
      this.detailLoading = false;
    },
    submitUser() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          switch (this.flg) {
            case '1': //新增
              this.addStaff();
              break;
            case '3': //编辑
              this.detailTitle = '编辑用户';
              this.editStaff();
              break;
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    reset() {
      for (let i in this.ruleForm) {
        this.ruleForm[i] = '';
      }
      this.$refs.ruleForm.resetFields();
    },
    handleClose() {
      // this.reset()
      this.$refs.ruleForm.resetFields();
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
