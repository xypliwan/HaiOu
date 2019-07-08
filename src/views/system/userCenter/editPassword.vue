<template>
  <div>
    <el-dialog title="修改密码" :visible.sync="pwdVisible" width="500px" :before-close="handleClose">
      <div>
        <el-form :model="ruleForm" size="small" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-loading="formLoading">
          <el-form-item label="旧密码" prop="old_password">
            <el-input v-model="ruleForm.old_password" type="password" clearable placeholder="请输入旧密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input v-model="ruleForm.password" type="password" clearable placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="repassword">
            <el-input v-model="ruleForm.repassword" type="password" clearable placeholder="请再次输入新密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button size="mini" @click="handleClose">关闭</el-button>
        <el-button size="mini" type="primary" @click="saveSubmit">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { changePassword } from '@/api/user';
export default {
  props: {
    pwdVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.ruleForm.repassword !== '') {
          this.$refs.ruleForm.validateField('repassword');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        old_password: '',
        password: '',
        repassword: ''
      },
      rules: {
        old_password: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }],
        repassword: [{ validator: validatePass2, trigger: 'blur' }]
      },
      formLoading: false
    };
  },
  methods: {
    saveSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.changePassword();
        } else {
          return false;
        }
      });
    },
    async changePassword() {
      this.formLoading = true;
      try {
        let { message } = await changePassword(this.ruleForm);
        this._message(message, 'success');
        this.handleClose();
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },
    handleClose() {
      this.$refs.ruleForm.resetFields();
      this.$emit('update:pwdVisible', false);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
