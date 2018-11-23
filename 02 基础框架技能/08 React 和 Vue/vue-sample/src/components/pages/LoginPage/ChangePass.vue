<template lang="pug">
div.login-page
    div.login-box
        div.header {{$t('LOGIN_TITLE')}}
            el-form(
                label-position="right" 
                :model="passForm" 
                status-icon 
                :rules="rules" 
                ref="passForm" 
                label-width="80px" 
                class="login-form")
                el-form-item(label="旧密码" prop="oldPass")
                    el-input(type="password" v-model="passForm.oldPass")
                el-form-item(el-form-item label="新密码" prop="pass")
                    el-input(type="password" v-model="passForm.pass")
                el-form-item(el-form-item label="确认密码" prop="checkPass")
                    el-input(type="password" v-model="passForm.checkPass" @keyup.enter.native="submit('passForm')")
                div.login-btn
                    el-button(type="primary" @click="submit('passForm')") {{$t('SUBMIT')}}  
</template>



<script>
    import md5 from 'md5'
    import {mapState} from 'vuex'
    import {changePass} from '../../../api'
    import {
        PRODUCT_LIST, ACCOUNT_LIST, TEMPLATE_MGMT, USER_LOGIN, CHANGE_PASS
    } from '../../../constant'
    export default {
        data () {
            let validateOldPass = (rule, value, callback) => {
                if (md5(value) !== this.oldPass) {
                    callback(new Error('密码错误'))
                } else {
                    callback()
                }
            }

            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空'))
                } else {
                    callback();
                }
            }
            var validateCheckPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.passForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            return {
                passForm: {
                    oldPass: '',
                    pass: '',
                    checkPass: '',
                },
                rules: {
                    oldPass: [
                        {validator: validateOldPass, trigger: 'blur'}
                    ],
                    pass: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    checkPass: [
                        {validator: validateCheckPass, trigger: 'blur'}
                    ]
                }
            }
        },
        computed: {
            ...mapState({
                oldPass: state => state.loginPass,
                loginName: state => state.loginName
            })
        },
        methods: {
            submit(formName) {
                let me = this;
                this.$refs[formName].validate((valid) => {      
                    if (!valid) {
                        return false;
                    }
                    let param = {
                        loginName: me.loginName,
                        oldPass: me.passForm.oldPass,
                        loginPass: me.passForm.pass
                    } 
                    changePass(param).then((res) => {
                        me.$router.push({name: USER_LOGIN})
                    })

                });
            }
        }
    }    
</script>

<style scoped lang="stylus">
.login-page
    position absolute;
    left 0;
    right 0;
    top 0;
    bottom 0;

    .login-box
        margin 0 auto;
        width 400px;
        height 523px;
        position absolute;
        top 50%;
        left 50%;
        transform translateX(-50%) translateY(-50%);
        box-shadow:0 1px 5px #ccc;
        

        .header
            text-align center;
            height 100px;
            line-height 100px;
            color black;
            font-size 20px;
            width 100%;
        

        .login-form 
            margin 0 auto;
            margin-top 20px;
            padding 20px;

            .login-btn 
                margin-top 50px;
                text-align center;
</style>