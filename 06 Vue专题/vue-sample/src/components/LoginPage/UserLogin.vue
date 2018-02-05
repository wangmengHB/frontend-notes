<template lang="pug">
div.login-page
    div.login-box
        div.header 思必驰企业名片ADMIN登录
            el-form(label-position="right" :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="80px" class="login-form")
                el-form-item(label="用户名" prop="loginName")
                    el-input(v-model="loginForm.loginName")
                el-form-item(el-form-item label="密码" prop="loginPass")
                    el-input(type="password" v-model="loginForm.loginPass")
                div.login-btn
                    el-button(type="primary" @click="submitForm('loginForm')") 登录

</template>


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


<script>
import {userLogin} from '../../api'
import axios from 'axios'
import {
    PRODUCT_LIST, ACCOUNT_LIST, TEMPLATE_MGMT, USER_LOGIN, CHANGE_PASS
} from '../../constant'

export default {
    data() {

      let validateName = (rule, value, callback) => {
          if (value === '') {
              callback(new Error('用户名不能为空'))
          } else {
              callback();
          }
      }
      let validatePass = (rule, value, callback) => {
          if (value === '') {
              callback(new Error('密码不能为空'))
          } else {
              callback();
          }
      }

      return {
        loginForm: {
          loginName: '',
          loginPass: ''
        },
        rules: {
          loginName: [
              {validator: validateName, trigger: 'blur'}
          ],
          loginPass: [
              {validator: validatePass, trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        let me = this;
        this.$refs[formName].validate((valid) => {      
          if (!valid) {
              return false;
          }
          userLogin(this.loginForm).then((res) => {
              axios.defaults.headers.authToken = res.result;
              me.$store.commit('LOGIN', me.loginForm)
              me.$router.push({name: PRODUCT_LIST})
          })

        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
    
</script>