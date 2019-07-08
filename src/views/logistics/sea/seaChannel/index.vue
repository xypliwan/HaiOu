<template>
  <div>
    <search-condit @search="search" @reset="reset"></search-condit>

    <div class="operat-box">
      <el-button size="mini" class="fr" type="primary" @click="seeDetail('','1')">添加海运渠道</el-button>
    </div>

    <div class="table table-box">
      <el-table v-loading="tableLoading" :data="tableData" style="width: 100%" :row-style="this.$root.tableContentStyle" :header-cell-style="this.$root.tableTitileStyle" stripe>
        <el-table-column header-align="center" align="center" label="NO" width="50" fixed>
          <template slot-scope="scope">
            <div>{{(scope.$index + 1) + (params.page-1)*params.pageSize}}</div>
          </template>
        </el-table-column>
        <el-table-column label="渠道代码" prop="cc_code" width="150" fixed></el-table-column>
        <el-table-column label="中文名称" prop="cc_name" width="200"></el-table-column>
        <el-table-column label="英文名称" prop="cc_name_en" width="200"></el-table-column>
        <el-table-column label="货运时效(天)">
          <template slot-scope="scope">
            <div>{{scope.row.cc_delivery_time_min}} - {{scope.row.cc_delivery_time_max}}</div>
          </template>
        </el-table-column>
        <el-table-column label="是否官网显示">
          <template slot-scope="scope">
            <div>{{ scope.row.is_web_show == '0' ? '否' : '是' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="cc_update_time" width="150"></el-table-column>
        <el-table-column label="操作" fixed="right" width="100" header-align="center" align="center">
          <template slot-scope="scope">
            <div class="cz-box">
              <el-link type="primary" @click="seeDetail(scope.row.cc_id,'2')">编辑</el-link>
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
    <add-sea-channel :channelVisible.sync="channelVisible" :unitList="unitList" :flg="flg" :id="id" @saveOk="getContainerChannelList"></add-sea-channel>
  </div>
</template>

<script>
import AddSeaChannel from './AddSeaChannel';
import SearchCondit from './SearchCondit';
import CustomizePage from '_c/CustomizePage';
import { getStatus, getDict } from '@/api/common';
import { getContainerChannelList } from '@/api/logistics';
export default {
  data() {
    return {
      channelVisible: false,
      unitList: [], //计算单位
      flg: '', //1新增   2编辑
      id: '',
      params: {
        cc_code: '', //渠道代码
        cc_name: '', //渠道名称
        page: 1,
        pageSize: 10
      },
      tableData: [],
      tableLoading: false,
      pageSizeArr: [10, 20, 30, 40],
      total: null,
      statusList: []
    };
  },
  created() {
    this.getContainerChannelList();
    this.getStatus('container_channel_status');
    this.getDict('cal_unit');
  },
  watch: {
    channelVisible(newVal) {
      if (!newVal) {
        this.flg = '';
      }
    }
  },
  methods: {
    async getDict(type) {
      //获取计算单位
      try {
        let { data } = await getDict({ dict_code: type });
        this.unitList = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getStatus(type) {
      try {
        let { data } = await getStatus({ status_code: type });
        this.statusList = data;
      } catch (error) {
        this._message(error);
      }
    },
    async getContainerChannelList() {
      this.tableLoading = true;
      //获取海运渠道列表
      try {
        let { data, paginator } = await getContainerChannelList(this.params);
        this.tableData = data;
        this.total = paginator.totalCount;
      } catch (error) {
        this._message(error);
      }
      this.tableLoading = false;
    },
    search(params) {
      Object.assign(this.params, params);
      this.params.page = 1;
      this.getContainerChannelList();
    },
    reset(params) {
      Object.assign(this, params, params);
    },
    customizePage(pageSize) {
      this.pageSizeArr[4] = pageSize;
      this.params.pageSize = pageSize;
      this.getContainerChannelList();
    },
    handleSizeChange(e) {
      //设置显示一页展示多少条数
      this.params.pageSize = e;
      this.getContainerChannelList();
    },
    handleCurrentChange(e) {
      //点击第几页
      this.params.page = e;
      this.getContainerChannelList();
    },
    seeDetail(number, flg) {
      this.id = number;
      this.flg = flg;
      this.channelVisible = true;
    }
  },
  components: {
    AddSeaChannel,
    SearchCondit,
    CustomizePage
  }
};
</script>

<style lang="scss" scoped>
.table {
  margin-top: 10px;
}
</style>

