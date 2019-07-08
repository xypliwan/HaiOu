<template>
  <div class="my-info">
    <titles titles="我的信息"></titles>
    <el-form :model="ruleForm" size="small" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-loading="fromLoading">
      <el-row>
        <el-col :span="7" class="mw400">
          <el-form-item label="账号">
            <div>{{ruleForm.user_account}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" class="mw400">
          <el-form-item label="中文名">
            <el-input v-if="isEdit" v-model="ruleForm.user_name" clearable></el-input>
            <div v-else>{{ruleForm.user_name || '暂未填写'}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" class="mw400">
          <el-form-item label="英文名">
            <el-input v-if="isEdit" v-model="ruleForm.user_name_en" clearable></el-input>
            <div v-else>{{ruleForm.user_name_en || '暂未填写'}}</div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="7" class="mw400">
          <el-form-item label="昵称">
            <el-input v-if="isEdit" v-model="ruleForm.nick_name" clearable></el-input>
            <div v-else>{{ruleForm.nick_name || '暂未填写'}}</div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="7" class="mw400">
          <el-form-item label="QQ号码">
            <el-input v-if="isEdit" v-model="ruleForm.qq_number" clearable></el-input>
            <div v-else>{{ruleForm.qq_number || '暂未填写'}}</div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="7" class="mw400">
          <el-form-item label="邮箱">
            <el-input v-if="isEdit" v-model="ruleForm.user_email" clearable></el-input>
            <div v-else>{{ruleForm.user_email || '暂未填写'}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" style="margin-top:30px;" class="mw400">
          <el-form-item label>
            <el-button size="small" type="primary" @click="isEdit = !isEdit">{{ isEdit ? '取消编辑' : '编辑' }}</el-button>
            <el-button size="small" type="primary" plain @click="pwdVisible=true">修改密码</el-button>
            <el-button size="small" v-show="isEdit" @click="saveData">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <edit-password :pwdVisible.sync="pwdVisible"></edit-password>
  </div>
</template>

<script>
import Titles from '_c/common/Titles';
import EditPassword from './editPassword';
import { getUserInfo, editUser } from '@/api/user';
export default {
  data() {
    return {
      ruleForm: {
        user_account: '', //'用户账号
        user_name: '', //用户中文名
        user_name_en: '', //用户英文名
        nick_name: '', //用户昵称
        qq_number: '', //qq号码
        user_email: '' //用户邮箱
      },
      rules: {},
      isEdit: false,
      fromLoading: false,
      pwdVisible: false
    };
  },
  created() {
    this.getUserInfo();
  },

  methods: {
    async saveData() {
      this.fromLoading = true;
      try {
        let { message } = await editUser(this.ruleForm);
        this._message(message, 'success');
        this.isEdit = false;
      } catch (error) {
        this._message(error);
      }
      this.fromLoading = false;
    },
    async getUserInfo() {
      this.fromLoading = true;
      try {
        let { data } = await getUserInfo();
        Object.assign(this.ruleForm, data);
      } catch (error) {
        this._message(error);
      }
      this.fromLoading = false;
    }
  },
  components: {
    Titles,
    EditPassword
  }
};
</script>

<style lang="scss" scoped>
.my-info {
  padding: 0 10px;
}
</style>
