
<template>
  <div class="printer">
    <div id="printer-tip"></div>
    <div>
      <el-card shadow="hover">
        <div class="title">
          <h4>打印机设置</h4>
        </div>
        <div class="content">
          <div class="get-printer">
            <el-button type="primary" size="mini" @click="getprinter">获取系统打印机</el-button>
            <ul class="printer-num">
              <li v-for="(item, index) in printerData" :key="index">{{item.printer_index+'.'+item.printer_name}}</li>
            </ul>
          </div>
          <div class="printer-download">
            <p>打印控件下载：</p>
            <ul class="printer-num">
              <li v-for="(item, index) in printerUrl" :key="index">
                <span @click="downloadPrinter(item)">{{item.file_name_cn}}</span>
              </li>
            </ul>
          </div>
        </div>
      </el-card>
    </div>
    <el-card shadow="hover" class="table-card">
      <div class="title">
        <h4>打印配置</h4>
      </div>
      <div class="table-box">
        <el-button type="primary" size="mini" @click="batchSet">批量设置</el-button>
        <el-table
          ref="printerTable"
          :data="printerType"
          stripe
          style="width: 100%;margin-top:10px"
          v-loading="tableLoading"
          :row-style="this.$root.tableContentStyle"
          :header-cell-style="this.$root.tableTitileStyle"
          @selection-change="selectChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column width="55" label="NO" fixed>
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" label="纸张" prop="type_name" fixed></el-table-column>
          <el-table-column label="打印机" prop="printer_name">
            <template slot-scope="scope">
              <span>{{scope.row.printer_index || ''}}</span>
              <span v-show="scope.row.printer_index && scope.row.printer_name">.</span>
              <span>{{scope.row.printer_name || ''}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" fixed="right" align="center" header-align="center">
            <template slot-scope="scope">
              <div class="cz-box">
                <el-link type="primary" @click="handleEdit(scope.row)">编辑</el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog title="绑定打印机" :visible.sync="dialogVisible" width="400px">
      <div class="dialog-content">
        <span class="label">选择打印机</span>
        <el-select class="label-value" v-model="printer_index" clearable placeholder="请选择" size="small">
          <el-option v-for="(item,index) in printerData" :key="index" :label="item.printer_index+'.'+item.printer_name" :value="item.printer_index" @click.native="getPrinterName(item)"></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="boundWidget">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { getTypes } from '@/api/common';
import { installLodop } from '@/api/system';
import { getPrint } from '@/utils/print/doPrint';
import { getLocalStorage, setLocalStorage } from '@/utils/localStorage';

export default {
  components: {},
  data() {
    return {
      printerType: [],
      printerUrl: [],
      printerData: [],
      tableLoading: false,
      dialogVisible: false,
      printer_name: '', //打印机名称
      printer_index: '', ///打印机序号
      selectPrinters: [] //选中的打印机
    };
  },
  watch: {},
  created() {
    this.getCommon();
  },
  mounted() {
    setTimeout(() => {
      this.getprinter();
    }, 500);
  },
  methods: {
    async getCommon() {
      try {
        const arr = getLocalStorage('printerBound');
        const res1 = await getTypes({ type_code: 'print_page_type' });
        this.printerType = res1.data;
        if (arr) {
          this.printerType.forEach(el => {
            arr.forEach(item => {
              if (el.type_index == item.type_index) {
                this.$set(el, 'printer_name', item.printer_name);
                this.$set(el, 'printer_index', item.printer_index);
              }
            });
          });
        }

        setLocalStorage('printerBound', this.printerType);

        const res2 = await installLodop();
        this.printerUrl = res2.data;
      } catch (error) {
        this._message(error);
      }
    },

    getprinter() {
      this.printerData = getPrint();
    },
    // 安装下载
    downloadPrinter(item) {
      window.open(item.file_url, '_blanck');
    },
    batchSet() {
      this.dialogVisible = true;
    },
    // 获取打印机名
    getPrinterName(val) {
      this.printer_name = val.printer_name;
    },
    // 绑定打印机
    boundWidget() {
      if (this.selectPrinters.length == 0) {
        this._message('请先勾选列表项');
      } else {
        this.selectPrinters.forEach(el => {
          this.$set(el, 'printer_name', this.printer_name);
          this.$set(el, 'printer_index', this.printer_index);
        });
        setLocalStorage('printerBound', this.printerType);
        this._message('绑定成功', 'success');
        this.$refs.printerTable.clearSelection();
      }
      this.dialogVisible = false;
    },
    // 编辑
    handleEdit(row) {
      this.dialogVisible = true;
      this.selectPrinters = [row];
    },

    selectChange(val) {
      this.selectPrinters = val;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '_a/styles/global.scss';

.printer {
  padding: 0 10px;
  .title {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    h4 {
      padding-left: 10px;
      border-left: 4px solid $bg;
    }
  }
  .content {
    padding-top: 20px;
    display: flex;
    .get-printer {
      width: 300px;
      text-align: center;
      .printer-num {
        border: 1px solid #eee;
        width: 250px;

        margin: 0 auto;
        text-align: left;
        padding: 10px 5px;
        margin-top: 10px;
        height: 150px;
        overflow-y: auto;
        li {
          height: 18;
          line-height: 18px;
        }
      }
    }
    .printer-download {
      flex: 1;
      .printer-num {
        padding: 10px 0px;
        margin-top: 10px;
        li {
          height: 22;
          line-height: 22px;
          color: #2a67ff;
        }
      }
    }
  }
  .dialog-content {
    display: flex;
    .label {
      width: 100px;
      height: 32px;
      line-height: 32px;
      text-align: right;
      padding-right: 10px;
    }
    .label-value {
      flex: 1;
      margin-right: 20px;
    }
  }
}
.table-card {
  //   width: 80%;
  margin-top: 20px;
}
.table-box {
  padding-top: 10px;
}
.cz-box {
  /deep/ .el-divider {
    background: #13a468;
  }
}
</style>


