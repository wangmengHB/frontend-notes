<template>
  <div class="main">
    <div class="header">
      <div class="card">
        <el-row>
            <el-col :span='12'>
                <svg class="iconfont r" aria-hidden="true" style='height:50px;width:70px;'>
                    <use xlink:href="#icon-duilogo"></use>
                </svg>
            </el-col>
            <el-col :span='12'>
                <span class='l ml15 g6 f18'>Admin管理</span>
            </el-col>  
        </el-row>
      </div>
      <div class="login" :style='user_icon_style'>
        <div class='user_icon' >
            <i class='icon-usercircle iconfont' @click.stop='userConfig'></i>
        </div>
        <div class='dropdown-menu-container' :class="{'active':user_config_active}" 
            :style="dropdown_menu_style">
            <ul class="dropdown-menu-list">
              <li><p>{{loginName}}</p></li>
              <li class="divider"></li>
              <li @click="changePassWord" class='pointer'>修改密码</li>
              <li class="divider"></li>
              <li  @click="log_out" class='pointer'><p>退出登录</p></li>
            </ul>
        </div>
       
      </div>


    </div>

    <div class="content">
        <transition name="sidemenu">

          <div class="catalog">
            <div class="catalog-content">
              <p class="catalog-name">企业名片</p>
              <ul class="catalog-list mt30">
                <el-menu
                    class="el-menu-vertical-demo"
                    :default-active="activeTab"
                    @select='menuSelect'
                    >
                    <el-menu-item :index="item.routeName" v-for='item in menuList' :key="item.label">
                        <i :class="[item.icon]"></i>
                        <span>{{item.label}}</span>
                    </el-menu-item>
                </el-menu>
              </ul>
            </div>
          </div>
        </transition>
      <div class="detail">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import {userLogout} from '../../api';
  import {mapState} from 'vuex';
  import {
    PRODUCT_LIST, ACCOUNT_LIST, TEMPLATE_MGMT, USER_LOGIN, CHANGE_PASS
  } from '../../constant'
  export default {
    data() {
      return {
        menuList:[
            {routeName: PRODUCT_LIST, label:'注册企业名片',icon:'el-icon-setting'},
            {routeName: ACCOUNT_LIST, label:'注册用户',icon:'el-icon-service'},
            {routeName: TEMPLATE_MGMT, label:'企业名片模板',icon:'el-icon-upload'},
        ],
        user_icon_style:{},
        dropdown_menu_style:{},
        user_config_active:false,
      }
    },
    computed:{
        ...mapState({
            activeTab: state => state.activePage,
            loginName: state => state.loginName
        }),
    },
    mounted(){
        this.$nextTick(()=>{
            var width =  window.getComputedStyle(this.$el.querySelector('.dropdown-menu-container'),null).getPropertyValue("width");
            var height = window.getComputedStyle(this.$el.querySelector('.dropdown-menu-container'),null).getPropertyValue("height");
            width = Number(width.split('px')[0]) + 10 +'px';
            height = -(Number(width.split('px')[0]) + 5) +'px';
            this.user_icon_style ={
               width:width
            }
            this.dropdown_menu_style ={
                top:height
            }
        })
        document.body.addEventListener('click',(e)=>{
            if(!this.user_config_active){
                return;
            }
            var node  = this.$el.querySelector('.dropdown-menu-container')
            if(node.contains(e.target)){
                return
            }
            this.user_config_active = false;
        })
    },
    methods:{
      log_out() {
        this.$confirm('你确定要退出登陆吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            //调用删除操作
              this.logout()  
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消退出'
            });          
        });
      },
      logout(){ // 退出登录
        let me = this;
        userLogout().then(res => {
            me.$store.commit("LOGOUT")
            me.$router.push({name: USER_LOGIN})
        })
      },
      menuSelect(routeName){
        this.$router.push({name:routeName})
      },
      userConfig(){
        this.user_config_active = !this.user_config_active;
      },
      changePassWord(){
        this.$router.push({name: CHANGE_PASS})
      }
    },

  }
</script>

<style scoped lang='scss'>
    $base_bg:#fff;
    $header_height: 50px;
    //rgb(84, 92, 100)
  .main{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #f4f4f4;
    color:#333;
  }

  .main .header{
    width: 100%;
    height: $header_height;
    background-color: $base_bg;
    box-shadow: 0 1px 3px #ccc;
  }

  .main .header .card{
    text-align: center;
    width: 250px;
    height: 100%;
    line-height: 50px ;
    font-size: 17px;
    cursor:pointer
  }

  .main .header .login {
    width: 160px;
    position: absolute;
    right: 0;
    top: 0;
    z-index:9; 
    .user_icon{
        // background: $base_bg;
        height:50px;
    }
    .iconfont{
        position: absolute;
        top: 0px;
        line-height: 50px;
        right: 15px;
        font-size: 30px;
        cursor:pointer;
    }
    .dropdown-menu-container{
        position:absolute;
        // top:-200px;
        right:3px;
        z-index:-1;
        transition:all .6s;
        .dropdown-menu-list{
            background: #fff;
            border:1px solid #ddd;
            box-shadow: 0 2px 9px rgba(0,0,0,.2);
            border-radius:5px;
            white-space: nowrap;
            padding: 0 10px;
            box-sizing: border-box;
            min-width:150px;
            text-align:center;
            line-height: 34px;
            color:#666;
            .divider{
                height:1px;
                margin:5px 0;
                background: #ccc;
            }
        }
        &.active{
            top:52px ! important;
        }
    }
    
  }
 

  .main .content{
    width: 100%;
    height: calc(100% - #{$header_height});
    box-shadow:0 1px 5px #ccc;
  }

  .main .content .catalog{
    // width: 250px;
    height: 100%;
    float: left;
    background-color: $base_bg;
    box-shadow:0 1px 5px #ccc;
    
    // 0 0 8px 0 rgba(232,237,250,.6);
    // 0 2px 4px 0 rgba(232,237,250,.5);
  }

  .main .content .detail{
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100% - 60px);
    padding: 30px;
  }

  .main .content .catalog .catalog-content{
    width: 100%;
    height: 100%;
    width:250px;
    // text-align: center;
  }

  .main .content .catalog .catalog-content .catalog-name{
    margin-top: 40px;
    width: 100%;
    text-align: center;
  }

    .sidemenu-enter-active, .sidemenu-leave-active {
        width:250px;
        overflow:hidden;
        transition: all .5s;
        .catalog-content{
            transition: all .5s;
            transform:translateX(0px);
        }
    }
    .sidemenu-enter, .sidemenu-leave-to /* .fade-leave-active in below version 2.1.8 */ {
        width:0px;
        .catalog-content{
            transform:translateX(-250px);
        }
    }

</style>

