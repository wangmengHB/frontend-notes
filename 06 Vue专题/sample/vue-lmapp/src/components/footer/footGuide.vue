<template>
    <section id='foot_guide'>
        <section @click = "gotoAddress('home')" class="guide_item">
            <img src="../../images/home.png" class="icon_home">
        </section>
        <section @click = "gotoAddress('report')" class="guide_item">
            <div class="icon_style" :class="$route.path === '/report'? 'icon_yongjin_active' : 'icon_yongjin'"></div>
            <div :class="$route.path === '/report'? 'active': ''">佣金</div>
        </section>
        <section @click = "gotoAddress('me_msg')" class="guide_item">
            <div class="icon_style" :class="$route.path === '/me_msg'? 'icon_msg_active' : 'icon_msg'"></div>
            <div :class="$route.path === '/me_msg'? 'active': ''">消息</div>
        </section>
        <section @click = "gotoAddress('me')" class="guide_item">
            <div class="icon_style" :class="$route.path === '/me'? 'icon_me_active' : 'icon_me'"></div>
            <div :class="$route.path === '/me'? 'active': ''">我</div>
        </section>
    </section>
</template>

<script>
    import {mapState} from 'vuex'
    import {log} from 'src/config/mUtils'
    export default {
    	data(){
            return{
                jumpMap: { //页面跳转埋点日志
                    home: {path: "/home", log: "MJingFen_Home"},
                    report: {path: "/report", log: "MJingFen_Brokerage"},
                    me_msg: {path: "/me_msg", log: "MJingFen_Message"},
                    me: {path: "/me", log: "MJingFen_My"},
                },
            }
        },
        created(){
           
        },
        mounted(){
            
        },
        computed: {

        },
        methods: {
        	gotoAddress(path){
                log(this.jumpMap[path]['log'])
        		this.$router.push(this.jumpMap[path]['path'])
        	}
        },

    }

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';

    #foot_guide{
        background-color: #fff;
        position: fixed;
        z-index: 1;
        left: 0;
        right: 0;
        bottom: 0;
        @include wh(100%, 0.98rem);
        display: flex;
        box-shadow: 0 -0.026667rem 0.053333rem rgba(0,0,0,.1);
    }
    .guide_item{
        flex: 1;
        display: flex;
        text-align: center;
        flex-direction: column;
        align-items: center;
        .icon_style{
            @include wh(.44rem, .44rem);
            margin-top: .15rem;
            margin-bottom: .05rem;
            background-size:.44rem, .44rem;
            background-repeat:no-repeat;
        }
        div{
            @include sc(.2rem, #000);
        }
        .active{
            color: #FF2D2D;
        }
    }
    .icon_home{
        height: .98rem;
    }
    .icon_yongjin{
        background:url('../../images/yongjin.png');
    }
    .icon_yongjin_active{
        background:url('../../images/yongjin_active.png');
    }
    .icon_msg{
        background:url('../../images/msg.png'); 
    }
    .icon_msg_active{
        background:url('../../images/msg_active.png'); 
    }
    .icon_me{
        background:url('../../images/me.png');
    }
    .icon_me_active{
        background:url('../../images/me_active.png');
    }
   
</style>
