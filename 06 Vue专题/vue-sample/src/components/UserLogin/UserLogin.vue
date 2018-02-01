<template>
<div class="login-page">
 <div class="login-box">
    <div class="header">思必驰企业名片ADMIN登录</div>
    <el-form 
        :model="loginForm" status-icon 
        :rules="rules" 
        ref="loginForm" 
        label-width="100px" 
        class="login-form">
    <el-form-item label="用户名" prop="loginName">
        <el-input v-model="loginForm.loginName"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="loginPass">
        <el-input type="password" v-model="loginForm.loginPass" auto-complete="on"></el-input>
    </el-form-item>  
    <el-form-item class="login-btn">
        <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
    </el-form-item>
    </el-form>
    </div>
</div> 
</template>


<style scoped lang="scss">
.login-page {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    .login-box {
        margin: 0 auto;
        width: 400px;
        height: 523px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        box-shadow:0 1px 5px #ccc;
        

        .header {
            text-align: center;
            height: 100px;
            line-height: 100px;
            color: black;
            font-size: 20px;
            width: 100%;
        }

        .login-form {
            // width: 40%;
            margin: 0 auto;
            margin-top: 20px;
            padding: 20px;
        }

    }



}

</style>


<script>
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
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
    
</script>