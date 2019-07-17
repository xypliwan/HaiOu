import { Message } from "element-ui";
const minxin = {
    computed: {
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