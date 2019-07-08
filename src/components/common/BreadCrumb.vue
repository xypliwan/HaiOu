<template>
    <div class="bread-crumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(item,index) in breadCrumbs" :key="index"
                :to="{ path:item.path }"
                >
                <span :style="themeType.style.topTextColor">{{$t(item.name)}}</span> 
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    computed:{
        ...mapGetters(["breadCrumb","themeType"]),
        breadCrumbs(){
            return this.breadCrumb
        }
    }

}
</script>

<style lang="scss" scoped>
.bread-crumb{
    display: inline-block;
    float: left; 
    height: 45px;
    line-height: 45px;
    padding: 15px 20px;
}
</style>

