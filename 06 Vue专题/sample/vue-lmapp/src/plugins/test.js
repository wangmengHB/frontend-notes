import headTop from '../components/header/head'
import { getProxy } from '../service/proxy'
import footGuide from '../components/footer/footGuide'

export default {
    data() {
        return {
            headTitle: "查看更多",
            changeShowType: "week",
            isActive: true,
            balance: "",
            waitPayBalance: "",
            //昨日
            clickCount: "",
            cptOrderCount: "",
            cptOrderPrice: "",
            orderComm: "",
            //近7天
            clickCount7: "",
            cptOrderCount7: "",
            cptOrderPrice7: "",
            orderComm7: "",
        }
    },
    mounted() {
        //获取报表
        getProxy('/reportInfo').then(res => {


        }).then(() => {


        })

    },
    components: {
        headTop,
        footGuide,
    },
    methods: {
        gotoAddress(path) {
            this.$router.push(path)
        }
    },
}