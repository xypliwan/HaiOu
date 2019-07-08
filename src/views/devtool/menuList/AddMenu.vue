<template>
  <div>
    <el-dialog title="新增菜单" :visible.sync="menuVisible" width="800px" :before-close="handleClose">
      <div>
        <el-form :model="ruleForm" size="mini" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm" v-loading="menuLoading">
          <el-row>
            <el-col :span="11">
              <el-form-item label="菜单中文名称" prop="name">
                <el-input class="test-ipt" v-model="ruleForm.name" placeholder="请输入中文名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="菜单英文名称" prop="name_en">
                <el-input v-model="ruleForm.name_en" placeholder="请输入英文名称" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="菜单路径" prop="path">
                <el-input v-model="ruleForm.path" placeholder="请输入菜单路径" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="菜单编码" prop="menu_alias">
                <el-input v-model="ruleForm.menu_alias" placeholder="请输入菜单编码" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="菜单等级" prop="menu_lev">
                <el-select v-model="ruleForm.menu_lev" placeholder="请选择" @change="handeleLevChange">
                  <el-option :label="item.lev" :value="item.lev" v-for="(item,index) in menuLev" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="11" :offset="1" v-show="ruleForm.menu_lev !== '1'">
              <!-- <el-col :span="11" :offset="ruleForm.menu_lev == '3' ? 1 : 0" v-show="ruleForm.menu_lev !== '1'"> -->
              <el-form-item label="父级编码">
                <el-select v-model="ruleForm.parent" placeholder="请选择" filterable>
                  <el-option :label="item.name" :value="item.id" v-for="(item,index) in parentCode" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <!-- <el-form-item label="菜单图标" v-show="ruleForm.menu_lev == '2'"> -->
              <el-form-item label="菜单图标">
                <el-select v-model="ruleForm.menu_icon" placeholder="请选择">
                  <el-option :label="item.class" :value="item.class" v-for="(item,index) in menuIcon" :key="index">
                    <span style="float: left; color: #8492a6; font-size: 13px">{{ item.class }}</span>
                    <i class="iconfont" style="float: right" :class="item.class"></i>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="dlog-footer">
        <el-button @click="handleClose" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitForm" size="mini">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { menuSave, menuSearch } from '@/api/develop';
import { chinaReg, engNameReg } from '_u/reg';
export default {
  props: {
    menuVisible: {
      type: Boolean,
      default: false
    },
    menuId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      ruleForm: {
        name: '', //中文菜单名称
        name_en: '', //英文菜单名称
        path: '', //菜单路径
        menu_alias: '', //菜单编码
        id: '', //菜单ID
        menu_icon: '', //菜单图标 (一级菜单必填)
        menu_lev: '1', //菜单等级
        parent: '', //父级菜单ID  编码
        menu_sort: '' //菜单排序
      },
      rules: {
        name: [{ required: true, message: '请输入中文名称', trigger: 'blur' }],
        name_en: [{ required: true, message: '请输入英文名称', trigger: 'blur' }],
        path: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
        menu_alias: [{ required: true, message: '请输入菜单编码', trigger: 'blur' }],
        menu_lev: [{ required: true, message: '请选择菜单等级', trigger: 'change' }]
      },
      menuLev: [{ lev: '1' }, { lev: '2' }, { lev: '3' }], //菜单等级
      parentCode: [], //父级编码
      menuIcon: [
        { class: 'icon-wode' },
        { class: 'icon-fenlei' },
        { class: 'icon-dingdan' },
        { class: 'icon-lunchuan' },
        { class: 'icon-kuaidi' },
        { class: 'icon-yonghuguanli' },
        { class: 'icon-bianji3' },
        { class: 'icon-xitongguanli' },
        { class: 'icon-peizhi' },
        { class: 'icon-hetong' },
        { class: 'icon-huancun' },
        { class: 'icon-dayin' },
        { class: 'icon-moban' },
        { class: 'icon-jiage' },
        { class: 'icon-qudao' },
        { class: 'icon-version' },
        { class: 'icon-tongbu' }
      ],
      menuLoading: false
    };
  },
  watch: {
    menuId(newVal) {
      if (newVal !== '') {
        let params = {
          menu_id: newVal
        };
        this.menuDetail(params);
      }
    }
  },
  methods: {
    async menuDetail(params) {
      this.menuLoading = true;
      try {
        let { data } = await menuSearch(params);
        this.ruleForm = Object.assign(this.ruleForm, data[0]);
        this.menuSearch();
      } catch (error) {
        this._message(error);
      }
      this.menuLoading = false;
    },
    async menuSave() {
      this.menuLoading = true;
      if (this.menuId == '') this.ruleForm.id = '';
      try {
        let { message } = await menuSave(this.ruleForm);
        this._message(message, 'success');
        this.handleClose();
        this.$emit('addOk');
      } catch (error) {
        this._message(error);
      }
      this.menuLoading = false;
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.ruleForm.menu_lev == '1' && this.ruleForm.menu_icon == '') {
            this._message('请选择菜单图标', 'warning');
            return;
          } else if ((this.ruleForm.menu_lev == '2' || this.ruleForm.menu_lev == '3') && this.ruleForm.parent == '') {
            this._message('请选择父级编码', 'warning');
            return;
          }
          this.menuSave();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handeleLevChange(e) {
      if (e !== '1') {
        this.ruleForm.menu_icon = '';
        this.ruleForm.parent = '';
        this.menuSearch();
      } else {
        this.ruleForm.parent = '';
      }
    },

    async menuSearch() {
      //获取父级编码
      try {
        let { data } = await menuSearch({ menu_lev: this.ruleForm.menu_lev });
        this.parentCode = data;
      } catch (error) {
        this._message(error);
      }
    },
    handleClose() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm.menu_icon = '';
      this.ruleForm.parent = '';
      this.$emit('closeVisible', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.dlog-footer {
  text-align: center;
  margin-top: 50px;
}
</style>


