<template>
  <div @click.stop>
    <el-popover placement="bottom-start" trigger="manual" v-model="visible">
      <span class="refresh-address add-address" @click="addAddressList">
        <i class="el-icon-plus"></i>
      </span>
      <span class="refresh-address" @click="getAddressList">
        <i class="el-icon-refresh"></i>
      </span>
      <ul class="address-box" v-loading="refreshLoading">
        <li v-for="(every,index) in addressList" :key="index" @click="selectAddress(every)">
          <div>{{ every.contact_user }} &nbsp; &nbsp; {{ every.contact_phone }}</div>
          <div>{{ every.state }} {{ every.city }} {{ every.district }} {{ every.street }} {{ every.address1 }}</div>
        </li>
      </ul>
      <el-button type="text" size="small" slot="reference" @click="visible = !visible">{{text}}</el-button>
    </el-popover>
  </div>
</template>

<script>
import { getAddressList } from '@/api/company';
export default {
  props: {
    text: {
      type: String,
      default: '选择常用地址'
    }
  },
  data() {
    return {
      refreshLoading: false,
      addressList: [],
      visible:false
    };
  },
  created() {
    this.getAddressList();
  },
  mounted() {
      window.addEventListener('click', this.closePopover)
  },
  methods: {
    addAddressList() {
      //添加地址
      this.closePopover()
      this.$router.push('/address-management?add=true')
    },
    closePopover(){
        this.visible = false;
    },
    selectAddress(item) {
      //选择当前地址
      this.$emit('selectItem', item);
    },
    async getAddressList() {
      //获取常用地址
      this.refreshLoading = true;
      let params = {
        address_type: '2',
        page: 1,
        pageSize: 100
      };
      try {
        let { data } = await getAddressList(params);
        this.addressList = data;
      } catch (error) {
        this._message(error.message)
      }
      this.refreshLoading = false;
    }
  }
};
</script>


<style lang="scss" scoped>
@import '_a/styles/global.scss';
.address-box {
  max-height: 500px;
  overflow-y: auto;
  @include scrollBar;
  li {
    padding: 15px 0;
    border-bottom: 1px solid #f1f1f1;
    cursor: pointer;
    font-size: 13px;
    &:hover {
      color: #409eff;
    }
  }
}
.refresh-address {
  position: absolute;
  right: 15px;
  top: 10px;
  cursor: pointer;
  i {
    font-size: 18px;
  }
}
.add-address {
  right: 50px;
}
</style>
