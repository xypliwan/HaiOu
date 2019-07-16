import { Message } from "element-ui";
import { mapGetters } from 'vuex';
import { arrDeWeight,getDiffArr } from '_u/utils';
const minxin = {
    data() {
        return {
        }
    },
    deactivated() {
        // if (this.$options.name == 'companyManage') {        //销毁组件实例  修改路由name  增加组件name
        //     console.log('deactivated');
        //     this.$destroy()
        // }
        // this.$destroy()
        // console.log(this.$options.name)
        // console.log(this.$router.options.routes)
        let routerArr = this.$router.options.routes;
        let snapArr = [] 
        routerArr.forEach((el,i)=>{
            if(el.children){
                snapArr = [...snapArr,...el.children]
            }
        }) 

        let res = getDiffArr(this.tabList,snapArr,'name')
        res.forEach(el=>{       //获取未展现的组件
            // if(el.name == this.$options.name){
                // this.$destroy(el.name)
            // }
        })
      
        // console.log(snapArr)

    },
    // wat
    mounted() {
        // console.log(this.$route.path)
    },
    computed: {

        ...mapGetters(['tabList']),
        idDev() {
            return process.env.NODE_ENV === 'development'
        }
    },
    methods: {
        _message(msg, type = 'error') {
            Message({
                type: type,
                dangerouslyUseHTMLString: true,
                showClose: true,
                message: msg
            });
        },
        getMappingVal(arr, valkey, val, labkey) {
            let target = arr.filter(el => el[valkey] == val);
            return target.length > 0 ? target[0][labkey] : ''
        },
        isDisabledBtn(status, arr) {
            let flag = true;
            for (let i = 0; i < arr.length; i++) {
                if (status == arr[i]) {
                    flag = false;
                    break;
                } else {
                    flag = true;
                }
            }
            return flag;
        }
    },

}
export default minxin;