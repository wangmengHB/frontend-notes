<template>
    <div class="register-main">
        <header>
            <span class="close" @click="close()">×</span>
            <span class="title">开通京粉</span>
        </header>
        <section class="register-content">
            <div class="tab">
                <span v-for="(item, index) in userTypes" :key="index" :class="{selected: index == userType}" @click="changeUserType(index)">{{item}}
                    <i v-if="isTrueName && item == userType">（已实名）</i>
                    <i v-if="index == userType">（未实名）</i>
                </span>
            </div>
            <ul class="info">
                <li>
                    <input type="text" class="user-info" v-model="userInfo"  @disabled/>
                </li>
                <li>
                    <input class="mobile tel-num" id="telNum" v-model="telNum" placeholder="请输入手机号" />
                    <button class="btn_code" id="userCode">获取验证码</button>
                </li>
                <li>
                    <input type="text" v-model="code" maxlength="6" placeholder="请输入验证码"/>
                </li>
            </ul>
            <button class="login" @click="submit()">开通</button>
            <div class="agree">
                <input type="checkbox" v-model="isCheck"/>
                <span>我已阅读并同意<router-link to="/register/agreement" class="agreement">《京粉在线协议》</router-link></span>
            </div>
        </section>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import {getProxy, postProxy} from 'src/service/proxy'
import {setStore, isOk, isApp, isMobile, log, timeOut} from 'src/config/mUtils'

export default {
    data() {
        return {
            userInfo: '',
            isTrueName: false,
            telNum: '',
            userTypes: ['个人', '企业'],
            userType: 0,
            code: '',
            isCheck: true,
            isClick: false
        }
    },
    components: {

    },
    mounted(){
        postProxy('/getJDPin', {}).then(res => {
            if(isOk(res)){
                this.userInfo = res.data.pin;
            }
        })

        postProxy('/cert/verifyCertification', {}).then(res => {
            if(isOk(res)){
                this.isTrueName = res.data.isCert;

                //已经实名
                if( this.isTrueName ) {
                    let tureName = res.data.name;
                    let idCard = res.data.idCardNo;
                    this.userInfo = tureName+"（"+idCard+"）";

                    if(res.data.tel){
                        this.telNum = res.data.tel;
                    }
                }else{
                    //通过jdPin返回的电话
                    if( res.data.tel ) {
                        this.telNum = res.data.tel;
                    }

                }

                this.getVerifyCode();
            }
        })
    },
    methods: {
        getVerifyCode(){
            timeOut("#userCode","#telNum","/getSmsVerifyCode2");
        },
        changeUserType(index){
            this.userType = index;
            //企业、个人验证码初始化
            if(index == 0) {
                this.getVerifyCode();
                log("MJDUnion_Personal");
            } else {
                log("MJDUnion_Enterprise");
                this.getVerifyCode();
                if( this.isTrueName ){
                    // var btnArray = ['继续开通', '去注册'];
                    // mui.confirm('您的京东账号已经实名认证为：'+this.tureName+'<br>'+this.idCard+'<br>为了您的账号安全和使用方便请重新注册京东账号。', '温馨提示', btnArray, function(e) {
                    //     if ( e.index == 1 ){
                    //         $$.ajax({
                    //             type:"POST",
                    //             url:"/logout",
                    //             success:function(msgNum){
                    //                 if(isOk(msgNum, false)){
                    //                     location.href = "https://plogin.m.jd.com/cgi-bin/m/mreg?appid=253&returnurl=https%3A%2F%2Flmapp.jd.com%2F";
                    //                     log("register.jsp企业用户重新注册","register.jsp企业用户重新注册");
                    //                 }
                    //             }
                    //         });
                    //     }
                    // })
                }
            }
        },
        close(){
            postProxy('/logout', {}).then(res => {
                if(isOk(res, false)){
                    this.$router.push('/home');
                    util.log("register.jsp企业用户重新注册","register.jsp企业用户重新注册");
                }
            })
        },
        submit(){
            if(!this.isClick){
                util.log("MJDUnion_Start");
                let mobile = this.telNum;
                let code = this.code;
                let isAgreeBtn = this.isCheck;
                let ajaxUrl = "/v2/reg/person";

                if(this.userType == 1){ //用户类型
                    ajaxUrl = "/v2/reg/enterprise";
                }

                if(!isAgreeBtn) { //同意协议
                    // mui.toast('请阅读并同意《京粉在线协议》');
                    return false;
                }

                if(mobile.indexOf("*") != -1){ //手机号码
                    //取电话号码
                    mobile ="";
                }else{
                    if(!mobile){
                        // mui.toast('请输入联系人手机号码！');
                        return false;
                    }
                    if(!isMobile(mobile)) {
                        // mui.toast('手机号码格式错误，请重新输入！');
                        return false;
                    }

                }

                if(!code){ //验证码
                    // mui.toast('请获取验证码！');
                    return false;
                }
                if(!/^[0-9]{6}$/.test(code)){
                    // mui.toast('请输入6位数的验证码！');
                    return false;
                }

                postProxy(ajaxUrl, {"mobile": mobile,"verifyValue": code,"isAuth": this.isTrueName}).then(res => {
                    if(isOk(data)){
                        // mui.toast("开通成功");

                        //同意协议
                        getProxy('/cpsAgree').then(res => {
                            if (isOk(obj)) {
                                setStore('agree', 1);
                            } 
                        })

                        //乡亲APP渠道
                        let uaSR = window.navigator.userAgent;
                        if(uaSR.indexOf("XIANGQIN_APP") != -1) {
                            log("register_op_XIANGQIN_APP");
                        } else if(isApp()){
                            log("register_op_LMAPP");
                        }else {
                            log("register_op_H5");
                        }
                        this.$router.push('/home');
                    }
                })
            }
        }
    },
    computed: {

    },
    watch: {

    }
}
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
    register-main{
        background-color: rgb(250,250,250);
    }
    header{
        font-size:0.32rem;
        height:0.8rem;
        padding:0.2rem 0.32rem;
        span{
            display: inline-block;
        }
        .close{
            float: left;
        }
        .title{
            float: right;
        }
    }
    .register-content{
        margin:0.2rem 0.76rem;
        .tab{
            width:100%;
            overflow:auto;
            span{
                display: inline-block;
                padding-left:10px;
                width:50%;
                height:1rem;
                line-height: 1rem;
                float: left;
                font-size: 0.32rem;
            }
            i{
                font-style: normal;
                @include sc(0.24rem, #3E3936);
            }
        }
        .selected{
            color: #FD3636;
        }
        .info{
            list-style: none;
            margin:0.2rem 0 0 0;
            padding: 0;
            font-size: 0.28rem;
            li{
                border-bottom: 0.02rem solid #E4E4E4;
            }
            input{
                @include wh(100%, 0.8rem);
                line-height: 0.42rem;
                padding: 0.2rem;
                @include sc(0.28rem, #9B9B9B);
                background-color: #FAFAFA;
                margin-top: 0.28rem;
                margin-bottom: 0;
            }
            .mobile{
                width:2.4rem !important;
            }
            .btn_code{
                @include wh(1.94rem, 0.62rem);
                float: right;
                background-color: #E4E4E4;
                @include sc(0.28rem, #9B9B9B);
                border: 0;
                margin-top: 0.4rem;
            }
        }
        .login{
            @include wh(100%, 0.88rem);
            line-height: 0.64rem;
            background-color: #EA1D2B;
            @include sc(0.36rem, #fff);
            margin: 0.8rem auto 0.3rem;
        }
        .agree{
            font-size: 0.24rem;
            padding-left: 0.08rem;
            input{
                vertical-align: middle;
            }
            span{
                display: inline-block;
                margin-left: 0.02rem;
                line-height: 0.4rem;
                .agreement{
                    color: #EA1D2B;
                }
            }
        }
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>