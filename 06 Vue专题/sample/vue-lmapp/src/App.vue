<template>
	<div style="height: 100%;">
		<!-- <transition name="router-fade" mode="out-in"> -->
			<keep-alive>
			    <router-view v-if="$route.meta.keepAlive"></router-view>
			</keep-alive>
    	<!-- </transition> -->
    	<!-- <transition name="router-fade" mode="out-in"> -->
			<router-view v-if="!$route.meta.keepAlive"></router-view>
		<!-- </transition> -->
<!-- 		<mping-log src="http://wl.jd.com/unify.min.js"></mping-log>
		<baidu-tongji src="http://hm.baidu.com/hm.js?65bb76380bbf938dda64b395499a147f"></baidu-tongji>
		<wechat-share src="https://res.wx.qq.com/open/js/jweixin-1.0.0.js"></wechat-share> -->
    </div>
</template>

<script>
	import {isApp, getAppInfo,isOk} from 'src/config/mUtils'
	import {getProxy,jsonpProxyApiX} from 'src/service/proxy'

  	export default {
  		created(){
  			// window.os = 'ios';
  			// window.version = '2';
			//分享是否展示 true不展示 false展示
  			window.iosStyle = false;
  			if(isApp()){
		        let appInfo = getAppInfo();
		        window.os = appInfo && appInfo['os'] && appInfo['os'].toLowerCase();
		        window.version = parseInt(appInfo && appInfo['version']);
		        window.isNative=appInfo && appInfo['isNative'];
				console.log("appInfo",appInfo);
				if(isNative && version == 2){
					jsonpProxyApiX("JingFenAppConf",{"appPlatform":"ios"}).then(res => {
						if(isOk(res)){
							//搜索列表页面分享是否展示 1 展示 0 不展示
							window.searce_list_share = res.data.searce_list_share;
						}
					}).catch(err=>{
						console.log(err);
					});
				}
		        //if(os == 'ios' && version == 2) window.iosStyle = true;
  			}
  		},
  		mounted() {
		    const s = document.createElement('script');
		    s.type = 'text/javascript';
		    s.src = 'https://plogin.m.jd.com/st/js/logout.js';
		    document.body.appendChild(s);
        },
	   // components: {
		// 'wechat-share': {
		// 	render(createElement) {
		// 		return createElement('script', { attrs: { type: 'text/javascript', src: this.src }});
		// 	},
		// 	props: {
		// 		src: { type: String, required: true }
		// 	}
		// },
		// 'baidu-tongji': {
		// 	render(createElement) {
		// 		return createElement('script', { attrs: { type: 'text/javascript', src: this.src }});
		// 	},
		// 	props: {
		// 		src: { type: String, required: true }
		// 	}
		// },
		// 'mping-log': {
		// 	render(createElement) {
		// 		return createElement('script', { attrs: { type: 'text/javascript', src: this.src }});
		// 	},
		// 	props: {
		// 		src: { type: String, required: true }
		// 	}
		// }
	  // }
  	}
    window.clicentHeight=document.documentElement.clientHeight;
</script>

<style lang="scss">
  	@import './style/common';
	.router-fade-enter-active, .router-fade-leave-active {
	  	transition: opacity .3s;
	}
	.router-fade-enter, .router-fade-leave-active {
	  	opacity: 0;
	}
</style>
