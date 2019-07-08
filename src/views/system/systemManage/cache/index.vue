<template>
  <div>
    <search-condit :cacheType="cacheType" @search="search" @reset="reset"></search-condit>
    <div class="operat-box">
      <el-button type="primary" size="mini" class="fr" @click="lookDetail('','1')">新增</el-button>
    </div>

    <div class="table-box tables">
      <el-table v-loading="tableLoading" :data="tableData" style="width: 100%" :row-style="this.$root.tableContentStyle" :header-cell-style="this.$root.tableTitileStyle" stripe>
        <el-table-column type="selection" width="55" v-if="params.doc_status == '1'"></el-table-column>
        <el-table-column header-align="center" align="center" label="NO" width="50" fixed>
          <template slot-scope="scope">
            <div>{{(scope.$index + 1) + (params.page-1)*params.pageSize}}</div>
          </template>
        </el-table-column>
        <el-table-column label="应用" width="200" fixed>
          <template slot-scope="scope">
            <div>代码: {{scope.row.c_app}}</div>
            <div>名称: {{scope.row.c_name}}</div>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <div>{{getMappingVal(cacheType,'type_index',scope.row.c_type,'type_name')}}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div>状态: {{scope.row.c_status == '0' ? '停用' : '启用'}}</div>
            <div>执行: {{getMappingVal(statusList,'index',scope.row.c_sync_status,'name') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="有效期(分)" prop="c_validity_period"></el-table-column>
        <el-table-column label="备注" prop="c_note" show-overflow-tooltip></el-table-column>
        <el-table-column label="时间" width="220">
          <template slot-scope="scope">
            <div>更新时间: {{scope.row.last_update_date}}</div>
            <div>过期时间: {{scope.row.c_expire_date}}</div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" header-align="center" align="center" fixed="right">
          <template slot-scope="scope">
            <div class="cz-box">
              <el-link type="primary" @click="lookDetail(scope.row.c_id,'3')">编辑</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="primary" v-show="scope.row.doc_status !== '3'" @click="submitDeleteCache(scope.row.c_id)">删除</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-sizes="pageSizeArr"
        :page-size="params.pageSize"
        layout="total, sizes,slot, prev, pager, next, jumper"
        :total="total"
      >
        <customize-page @customizePage="customizePage"></customize-page>
      </el-pagination>
    </div>

    <edit-cache :cacheVisible.sync="cacheVisible" :id="id" :flg="flg" :cacheType="cacheType" @saveOk="getCacheList"></edit-cache>
  </div>
</template>

<script>
import SearchCondit from './SearchCondit';
import EditCache from './EditCache';
import CustomizePage from '_c/CustomizePage';
import { getTypes, getStatus } from '@/api/common';
import { getCacheList, deteleCache } from '@/api/system';
export default {
  data() {
    return {
      flg: '', //1新增  2查看   3编辑
      id: '',
      cacheVisible: false,
      cacheType: [], //缓存类型
      statusList: [], //状态列表
      params: {
        c_type: '', //类型
        c_name: '', //名称
        page: 1,
        pageSize: 10
      },
      tableLoading: false,
      tableData: [],
      pageSizeArr: [10, 20, 30, 40],
      total: null
    };
  },
  created() {
    this.getTypes('cache_type');
    this.getCacheList();
    this.getStatusList('execute_status');
  },
  mounted() {},
  watch: {
    cacheVisible(newVal) {
      if (!newVal) {
        this.flg = '';
      }
    }
  },
  methods: {
    submitDeleteCache(id) {
      this.$confirm('确定删除该条缓存吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deteleCache(id);
        })
        .catch(() => {});
    },
    async deteleCache(id) {
      try {
        let { message } = await deteleCache({ c_id: id });
        this._message(message, 'success');
        this.getCacheList();
      } catch (error) {
        this._message(error);
      }
    },
    async getCacheList() {
      this.tableLoading = true;
      try {
        let { data, paginator } = await getCacheList(this.params);
        this.tableData = data;
        this.total = paginator.totalCount;
      } catch (error) {
        this._message(error);
      }
      this.tableLoading = false;
    },
    search(params) {
      Object.assign(this.params, params);
      this.getCacheList();
    },
    reset(params) {
      Object.assign(this.params, params);
    },
    lookDetail(number, flg) {
      this.id = number;
      this.flg = flg;
      this.cacheVisible = true;
    },
    deleteCache(id) {},
    async getStatusList(status) {
      //获取状态
      try {
        let { data } = await getStatus({ status_code: status });
        data.forEach(el => {
          el.index = el.status_index;
          el.name = el.status_name;
          el.count = '';
        });
        this.statusList = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getTypes(type) {
      try {
        let { data } = await getTypes({ type_code: type });
        this.cacheType = data;
      } catch (error) {
        this._message(error);
      }
    },
    customizePage(pageSize) {
      this.pageSizeArr[4] = pageSize;
      this.params.pageSize = pageSize;
      this.getCacheList();
    },
    handleSizeChange(e) {
      //设置显示一页展示多少条数
      this.params.pageSize = e;
      this.getCacheList();
    },
    handleCurrentChange(e) {
      //点击第几页
      this.params.page = e;
      this.getCacheList();
    }
  },
  components: {
    SearchCondit,
    EditCache,
    CustomizePage
  }
};
</script>

<style lang="scss" scoped>
.tables {
  margin-top: 10px;
}
</style>
