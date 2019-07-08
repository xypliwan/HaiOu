
<template>
    <div class="pagination">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20, 30, 40]"      
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>

  export default {
    props:{
        pageSize:{
            type:[String,Number],
            default:10
        },
        page:{
            type:[String,Number],
            default:1
        },
        total:{
            type:[String,Number],
            default:1
        }

    },
    data() {
      return {
        
      };
    },
    methods: {
      handleSizeChange(val) {       //设置每页多少条
        this.$emit('handleSizeChange',val)
      },
      handleCurrentChange(val) {    //跳转第几页
        this.$emit('handleCurrentChange',val)
      }
    },
    
  }
</script>

<style scoped>
.pagination{
    margin:40px 0;
    text-align: right;
}
</style>
