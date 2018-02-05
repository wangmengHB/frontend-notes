<template lang="pug">
div.login-page
    div.login-box
        div.header {{$t('LOGIN_TITLE')}}
            el-form(
                label-position="right" 
                :model="loginForm" 
                status-icon 
                :rules="rules" 
                ref="loginForm" 
                label-width="80px" 
                class="login-form")
                el-form-item(:label="$t('USERNAME')" prop="loginName")
                    el-input(v-model="loginForm.loginName")
                el-form-item(el-form-item :label="$t('PASSWORD')" prop="loginPass")
                    el-input(type="password" v-model="loginForm.loginPass" @keyup.enter.native="submitForm('loginForm')")
                div.login-btn
                    el-button(type="primary" @click.prevent="submitForm('loginForm')") {{$t('LOGIN')}}

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
      let me = this;
      let validateName = (rule, value, callback) => {
          if (value === '') {
              callback(new Error(me.$t('USERNAME_CAN_NOT_BE_EMPTY')))
          } else {
              callback();
          }
      }
      let validatePass = (rule, value, callback) => {
          if (value === '') {
              callback(new Error(me.$t('PASSWORD_CAN_NOT_BE_EMPTY')))
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