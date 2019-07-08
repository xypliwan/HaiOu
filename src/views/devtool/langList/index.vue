<template>
  <div>
    <search-box @add="add" :langGroupList="langGroupList" @search="search" @reset="reset" @changeGroupExt="changeGroupExt"></search-box>

    <div class="lang-download">
      <el-button type="primary" size="mini" icon="el-icon-download" @click="downloadVisible = true">下载语言包</el-button>
    </div>
    <div class="table-box">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        :row-style="this.$root.tableContentStyle"
        :header-cell-style="this.$root.tableTitileStyle"
        v-loading="tableLoading"
      >
        <el-table-column label="NO" width="55">
          <template slot-scope="scope">
            <div>{{(scope.$index + 1) + (params.page-1)*params.pageSize}}</div>
          </template>
        </el-table-column>
        <el-table-column label="代码">
          <template slot-scope="scope">
            <div>{{ `${scope.row.group_name}.${scope.row.lang_code}` }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="menu_alias" label="所属模块">
          <template slot-scope="scope">
            <div>{{ getMappingVal(langGroupList,'key',scope.row.group_name,'value') }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="lang_cn" label="中文名称"></el-table-column>
        <el-table-column prop="lang_en" label="英文名称"></el-table-column>

        <el-table-column prop="group_ext" label="文件类型"></el-table-column>
        <el-table-column prop="menu_icon" label="是否生效">
          <template slot-scope="scope">
            <el-tag size="mini" :type="scope.row.is_generate == '0' ? 'info' : 'success'">{{ scope.row.is_generate == '0' ? '未生效' : '生效' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="editDetail(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-wrapper">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <add-lang :langId="langId" @closeVisible="closeVisible" @addOk="getLangList" :langVisible="langVisible" :langGroupList="langGroupList" :langDetail="langDetail" @changeGroupExt="changeGroupExt"></add-lang>

    <download-lang :downloadVisible.sync="downloadVisible" :langGroupList="langGroupList"></download-lang>
  </div>
</template>

<script>
import SearchBox from './Search';
import AddLang from './AddLang';
import DownloadLang from './DownloadLang';
import { downLang, getLangList, getLangGroup } from '@/api/develop';

export default {
  data() {
    return {
      langVisible: false,
      langGroupList: [],
      params: {
        group_name: '', //语言分组(模块)
        group_ext: '', //分组类型:前端项目js,后端项目php
        lang_code: '', //语言编码
        lang_cn: '', //语言中文名称
        lang_en: '', //语言英文名称
        page: 1,
        pageSize: 10
      },
      tableData: [],
      total: null,
      tableLoading: false,
      langId: '',
      langDetail: {},
      downloadVisible: false
    };
  },
  created() {
    this.getLangGroup();
    this.getLangList();
  },
  mounted() {},
  methods: {
    changeGroupExt(type) {
      this.params.group_ext = type;
      this.getLangGroup();
    },
    editDetail(item) {
      this.langVisible = true;
      this.langId = item.id;
      this.langDetail = item;
    },
    async getLangList() {
      this.tableLoading = true;
      try {
        let { data, paginator } = await getLangList(this.params);
        this.tableData = data;
        this.total = paginator.totalCount;
      } catch (error) {
        this._message(error);
      }
      this.tableLoading = false;
    },
    handleSizeChange(e) {
      //设置显示一页展示多少条数
      this.params.pageSize = e;
      this.getLangList();
    },
    handleCurrentChange(e) {
      //点击第几页
      this.params.page = e;
      this.getLangList();
    },
    add() {
      this.langVisible = true;
    },
    closeVisible() {
      this.langVisible = false;
      this.langId = '';
      this.langDetail = {};
    },
    search(params) {
      //搜索
      this.params = Object.assign(this.params, params);
      this.params.page = 1;
      this.getLangList();
    },

    reset(params) {
      //重置
      this.params = Object.assign(this.params, params);
    },
    async getLangGroup() {
      //获取语言模块分组
      try {
        let { data } = await getLangGroup({ group_ext: this.params.group_ext });
        this.langGroupList = [];
        for (let i in data) {
          this.langGroupList.push({
            key: i,
            value: data[i]
          });
        }
      } catch (error) {
        this._message(error);
      }
    }
  },
  components: {
    SearchBox,
    AddLang,
    DownloadLang
  }
};
</script>

<style lang="scss" scoped>
.table-box {
  margin: 50px 0;
  margin-top: 10px;
}
.pagination-wrapper {
  text-align: right;
  margin-top: 20px;
}
.lang-download {
  text-align: right;
}
</style>
