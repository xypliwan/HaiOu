<template>
  <div>
    <el-carousel :height="height" :interval="5000">
      <el-carousel-item v-for="(item,index) in imgList" :key="index">
        <img :src="item" alt>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>

export default {
    props:{
        height:{
            type:[String,Number],
            default:'150px'
        },
        interval:{
            type:Number,
            default:3000
        },
        imgList:{
            type:Array,
            default:()=>[]
        }
    }
};
</script>
