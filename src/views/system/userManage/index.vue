<template>
  <div>
    <search-condit @search="search" @reset="reset"></search-condit>
    <div class="operat-box">
      <el-button size="mini" class="fr" type="primary" @click="lookDetail('','1')">新增用户</el-button>
    </div>
    <operat-type :operatType="statusList" @getStatus="getOperatStatus"></operat-type>
    <div class="table table-box">
      <el-table :data="tableData" style="width: 100%" :row-style="this.$root.tableContentStyle" :header-cell-style="this.$root.tableTitileStyle" v-loading="tableLoading" stripe>
        <el-table-column label="NO" width="55" fixed>
          <template slot-scope="scope">
            <div>{{(scope.$index + 1) + (params.page-1)*params.pageSize}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="admin_account" label="用户账户" width="200" fixed></el-table-column>
        <el-table-column prop="admin_name" label="中文名" width="150"></el-table-column>
        <el-table-column prop="admin_name_en" label="英文名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="nick_name" label="用户昵称" show-overflow-tooltip></el-table-column>

        <el-table-column prop="admin_email" label="邮箱"></el-table-column>
        <el-table-column label="日期" width="200">
          <template slot-scope="scope">
            <div>入职日期: {{scope.row.join_date}}</div>
            <div>离职日期: {{scope.row.leave_date}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="updated_time" label="更新时间" width="160"></el-table-column>
        <el-table-column prop="company_status" label="状态">
          <template slot-scope="scope">
            <div>
              <span
                class="status-point"
                :class="{
                    'status1':scope.row.admin_status === '10',
                    'status5':scope.row.admin_status === '8',
                    'status10':scope.row.admin_status === '0' 
                  }"
              ></span>
              {{ getMappingVal(statusList,'status_index',scope.row.admin_status,'status_name') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" header-align="center" align="center" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-link type="primary" @click="lookDetail(scope.row.admin_account,'2')">查看</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="primary" @click="lookDetail(scope.row.admin_account,'3')">编辑</el-link>
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

    <edit-data :editDialog.sync="editDialog" :adminAccount="adminAccount" :flg="flg" @saveOk="getStaffList"></edit-data>
  </div>
</template>

<script>
import SearchCondit from './SearchCondit';
import OperatType from '_c/common/OperatType';
import CustomizePage from '_c/CustomizePage';
import EditData from './EditData';
import { getStatus } from '@/api/common';
import { getStaffList } from '@/api/system';
export default {
  data() {
    return {
      statusList: [],
      pageSizeArr: [10, 20, 30, 40],
      params: {
        account: '',
        name: '',
        created_start: '',
        created_end: '',
        status: '',
        page: 1,
        pageSize: 10
      },
      tableData: [],
      total: null,
      tableLoading: false,
      editDialog: false,
      adminAccount: '',
      flg: '' //1新增  2查看  3编辑
    };
  },
  created() {
    this.getStatus();
    this.getStaffList();
  },
  watch: {
    editDialog() {
      if (!this.editDialog) this.flg = '';
    }
  },
  methods: {
    lookDetail(adminAccount, flg) {
      this.adminAccount = adminAccount;
      this.flg = flg;
      this.editDialog = true;
    },
    customizePage(pageSize) {
      this.pageSizeArr[4] = pageSize;
      this.params.pageSize = pageSize;
      this.getStaffList();
    },
    async getStaffList() {
      //获取员工列表
      this.tableLoading = true;
      try {
        let { data, paginator } = await getStaffList(this.params);
        this.tableData = data;
        this.total = paginator.totalCount;
      } catch (error) {
        this._message(error);
      }
      this.tableLoading = false;
    },
    async getStatus() {
      //获取状态
      try {
        let { data } = await getStatus({ status_code: 'admin_status' });
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
    getOperatStatus(status) {
      this.params.status = status;
      this.params.page = 1;
      this.getStaffList();
    },
    search(params) {
      this.params = Object.assign(this.params, params);
      this.params.page = 1;
      this.getStaffList();
    },
    reset() {
      this.params = Object.assign(this.params, params);
    },
    handleSizeChange(e) {
      //设置显示一页展示多少条数
      this.params.pageSize = e;
      this.getStaffList();
    },
    handleCurrentChange(e) {
      //点击第几页
      this.params.page = e;
      this.getStaffList();
    }
  },
  components: {
    SearchCondit,
    OperatType,
    CustomizePage,
    EditData
  }
};
</script>

<style lang="scss" scoped>
.diveld {
  border-top: 10px solid #f0f4f3;
}
</style>
