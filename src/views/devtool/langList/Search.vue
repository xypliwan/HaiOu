<template>
  <div>
    <div class="search-box">
      <el-row style="margin-top:20px;">
        <el-col style="width:335px;">
          <el-col style="width:70px;">
            <div class="input-label">语言代码</div>
          </el-col>
          <el-col style="width:200px;">
            <el-input clearable size="mini" placeholder="请输入语言代码" v-model="params.lang_code"></el-input>
          </el-col>
        </el-col>
        <el-col style="width:335px;line-height:30px;">
          <el-col style="width:70px;">
            <div class="input-label">文件类型</div>
          </el-col>
          <el-col style="width:200px;">
            <el-radio v-model="params.group_ext" label="js" @change="changeGroupExt('js')">JS</el-radio>
            <el-radio v-model="params.group_ext" label="php" @change="changeGroupExt('php')">PHP</el-radio>
          </el-col>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-col style="width:335px;">
          <el-col style="width:70px;">
            <div class="input-label">中文名称</div>
          </el-col>
          <el-col style="width:200px;">
            <el-input clearable size="mini" placeholder="请输入中文名称" v-model="params.lang_cn"></el-input>
          </el-col>
        </el-col>
        <el-col style="width:335px;">
          <el-col style="width:70px;">
            <div class="input-label">所属模块</div>
          </el-col>
          <el-col style="width:200px;">
            <el-select size="mini" clearable filterable v-model="params.group_name" placeholder="请选择">
              <el-option v-for="item in langGroupList" :key="item.value" :label="item.value" :value="item.key"></el-option>
            </el-select>
          </el-col>
        </el-col>
      </el-row>

      <el-row style="margin-top:20px;">
        <el-col style="width:335px;">
          <el-col style="width:70px;">
            <div class="input-label">英文名称</div>
          </el-col>
          <el-col style="width:200px;">
            <el-input clearable size="mini" placeholder="请输入英文名称" v-model="params.lang_en"></el-input>
          </el-col>
        </el-col>
        <el-col style="width:225px">
          <el-button size="mini" type="primary" @click="search">查询</el-button>&nbsp;&nbsp;
          <el-button size="mini" @click="reset">重置</el-button>&nbsp;&nbsp;
          <el-button size="mini" @click="add">新增</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    langGroupList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      params: {
        group_name: '', //语言分组(模块)
        group_ext: '', //分组类型:前端项目js,后端项目php
        lang_code: '', //语言编码
        lang_cn: '', //语言中文名称
        lang_en: '' //语言英文名称
      },
      groupExt: [
        {
          value: 'js',
          label: 'JS'
        },
        {
          value: 'php',
          label: 'PHP'
        }
      ]
    };
  },
  methods: {
    changeGroupExt(e) {
      this.$emit('changeGroupExt', e);
    },
    search() {
      this.$emit('search', this.params);
    },
    reset() {
      this.selectTime = '';
      for (let i in this.params) {
        this.params[i] = '';
      }
      this.$emit('reset', this.params);
    },
    add() {
      this.$emit('add');
    }
  }
};
</script>


<style lang="scss" scoped>
@import '@/assets/styles/mixin.scss';
.search-box {
  .input-label {
    color: #666;
    font-size: 13px;
    height: 100%;
    line-height: 30px;
    text-align: right;
    margin-right: 10px;
  }
}
</style>
