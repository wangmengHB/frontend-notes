<template>
  <div>
  	<head-top :goBack="true" :headTitle="headTitle">
	 </head-top>
	  <div class="jf-content">
			<div class="about_head">
				<img src="../../../src/images/logo_about.png">
				<p>京粉 <span class="version">V{{version}}</span></p>
			</div>
	  </div>
	  
	  <div class="jf-foot">
	  	 <a href="/agreement.jsp">《服务条款》</a>和<a href="/privacy.jsp">《隐私政策》</a>
	  </div>
  </div>
	
</template>

<script>
	import {mapMutations} from 'vuex'
	import headTop from 'src/components/header/head'
	import {imgBaseUrl,loginUrl} from 'src/config/env'
	import {showBack, animate,getStore,getAppInfo,isApp} from 'src/config/mUtils'
	
	import {getImgPath} from 'src/components/common/mixin'
	
	export default{
		data(){
			return {
				headTitle:"关于京粉",
				version:'2.0.0',
			}
		},
		components: {
    	headTop
    },
    mounted(){
    	 /*if(isApp()){
    	 	  this.version=getAppInfo().version;
    	 }*/
    },
		methods:{
			back(){
    		   this.$router.go(-1);
    	    },
		}
	}
</script>
<style lang="scss" scoped>
   @import 'src/style/mixin';
  html,body{
    height: 100%;
    width: 100%;
    background-color: #FFFFFF !important;
  }
  .jf-content{
  	  position: absolute;
      height: 100%;
      width: 100%;
      background: rgb(255,255,255);
  	 .about_head{
  	 	  font-size:0;
  	 	  text-align:center;
  	 	  padding-top: 3.64rem;
  	 	  img{
  	 	  	width: 2.06rem;
  	 	  	height: 2.06rem;
  	 	  }
  	 	  p{
  	 	  	font-size: 0.3rem;
  	 	  	color: rgb(102,102,102);
  	 	  	margin-top: 0.21rem;
  	 	  }
  	 }
  }
  .jf-foot{
  	  position: fixed;
  	  width: 100%;
  	  bottom: 0.5rem;
  	  font-size: 0.22rem;
  	  text-align: center;
  	  a{
  	  	 color: rgb(62,109,173);
  	  }
  }
  .version{
  	color: rgb(102,102,102);
  	font-size: 0.3rem;
  	font-family: "Medium";
  }
</style>