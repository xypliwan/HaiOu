<template>
  <div>
    <el-dialog title="子帐号列表" :visible.sync="subVisible" width="1300px" :before-close="handleClose">
      <el-table :data="tableData" style="width: 100%" :row-style="this.$root.tableContentStyle" :header-cell-style="this.$root.tableTitileStyle" v-loading="formLoading">
        <el-table-column prop="username" label="用户名" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
        <el-table-column prop="phone" label="手机号码" width="120"></el-table-column>
        <el-table-column label="用户类型">
          <template slot-scope="scope">
            <div>{{ scope.row.user_type == '1' ? '个人' : '公司' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="company_code" label="客户代码"></el-table-column>
        <el-table-column prop="qq_number" label="QQ号码"></el-table-column>
        <el-table-column prop="wechat_id" label="微信OpenID" width="130"></el-table-column>
        <el-table-column prop="is_admin" label="是否主账户" width="100">
          <template slot-scope="scope">
            <div>{{ scope.row.is_admin == '1' ? '是' : '否' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.status == '0'">已注销</span>
              <span v-if="scope.row.status == '9'">待激活</span>
              <span v-if="scope.row.status == '10'">已激活</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="时间" width="230">
          <template slot-scope="scope">
            <div>注册时间: {{scope.row.created_time}}</div>
            <div>更新时间: {{scope.row.updated_time}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="sub-pagination-box">
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

      <div class="dialog-footer">
        <el-button size="mini" @click="handleClose">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCustomerUserList } from '@/api/client';
import CustomizePage from '_c/CustomizePage';
export default {
  props: {
    subVisible: {
      type: Boolean,
      default: false
    },
    companyCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formLoading: false,
      tableData: [],
      pageSizeArr: [10, 20, 30, 40],
      total: null,
      params: {
        page: 1,
        pageSize: 10,
        company_code: ''
      }
    };
  },
  watch: {
    companyCode(newVal) {
      this.params.page = 1;
      this.params.pageSize = 10;
      this.params.company_code = newVal;
      this.getCustomerUserList();
    }
  },
  methods: {
    async getCustomerUserList() {
      this.formLoading = true;
      try {
        let { data, paginator } = await getCustomerUserList(this.params);
        this.tableData = data;
        this.total = paginator.totalCount;
      } catch (error) {
        this._message(error);
      }
      this.formLoading = false;
    },
    handleClose() {
      this.$emit('update:subVisible', false);
    },
    handleSizeChange(e) {
      //设置显示一页展示多少条数
      this.params.pageSize = e;
      this.getCustomerUserList();
    },
    handleCurrentChange(e) {
      //点击第几页
      this.params.page = e;
      this.getCustomerUserList();
    },
    customizePage(pageSize) {
      this.pageSizeArr[4] = pageSize;
      this.params.pageSize = pageSize;
      this.getCustomerUserList();
    }
  },
  components: {
    CustomizePage
  }
};
</script>


<style lang="scss" scoped>
.sub-pagination-box{
    text-align: right;
    margin-top: 20px;
}
</style>
