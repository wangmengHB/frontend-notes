<template>
	<div>
			<div class="me-jelly-top" @click="goLocationPage('me_bankinfo')">
				<div class="me_img">
					<img class="mui-media-object  head-img" id="head-img" src="../../../src/images/default.png">
				</div>
				<div v-if="isLogin" class="me_message" >
					 <h1>
					 	<span v-show="userInfo.nickName!=null" class="phone">{{userInfo.nickName}}</span>
					 	<span v-show="userInfo.nickName==null && userInfo.pin!=null" class="phone">{{userInfo.pin}}</span>
					 	<span v-show="userInfo.nickName==null && userInfo.pin==null" class="phone">账号未完善，请去完善</span>
					 	<span v-show="userInfo.accountType!=null" class="category">{{userInfo.accountType}}</span>
					 </h1>
					 <p class="me_lmId">联盟ID：{{userInfo.unionId}}</p>
					 <p class="me_statue">状态：{{userInfo.status}}<img v-if="userInfo.status=='资料待完善'" @click="tip()" src="../../images/me_tip.png"/></p>
				</div>
				<div v-else>
				   <div class="NoLogin">登录/注册</div>
			    </div>
				<div class="me_right">
					<img src="../../images/icon_more.png" />
				</div>
				
			</div>
			<div class="me-jelly-content">
				 <ul class="me-jelly-table-view" v-if="isLogin">
				 	<li class="me-jelly-table-view-cell" @click="goLocationPage('me_settgw')">
				 		<a>
				 			<div class="me_img">
				 			   <img src="../../images/settGw.png" />
				 			</div>
				 			<div class="me_right" style="border: none;">
					 			<div class="me_datail">设置默认推广位</div>
					 			<div class="icon_right">
									<img src="../../images/icon_more_2.png" />
								</div>
						    </div>
				 		</a>
				 	</li>
				 </ul>
				 
				 <ul class="me-jelly-table-view">
				 	<li class="me-jelly-table-view-cell">
				 		<a @click="goPage('helpnew')">
				 			<div class="me_img">
				 			   <img src="../../images/helpNew.png" />
				 			</div>
				 			<div class="me_right">
					 			<div class="me_datail">新手教程</div>
					 			<div class="icon_right">
									<img src="../../images/icon_more_2.png" />
								</div>
						    </div>
				 		</a>
				 	</li>
				 	<li class="me-jelly-table-view-cell">
				 		<a @click="share">
				 			<div class="me_img">
				 			   <img src="../../images/shareFriend.png" />
				 			</div>
				 			<div class="me_right">
					 			<div class="me_datail">分享给好友</div>
					 			<div class="icon_right">
									<img src="../../images/icon_more_2.png" />
								</div>
						    </div>
				 		</a>
				 	</li>
				 	<li class="me-jelly-table-view-cell">
				 		<a @click="goComment">
				 			<div class="me_img">
				 			   <img src="../../images/goComent.png" />
				 			</div>
				 			<div class="me_right">
					 			<div class="me_datail">去评分</div>
					 			<div class="icon_right">
									<img src="../../images/icon_more_2.png" />
								</div>
						    </div>
				 		</a>
				 	</li>
				 	<li class="me-jelly-table-view-cell">
				 		<a @click="goPage('me_about')">
				 			<div class="me_img">
				 			   <img src="../../images/about.png" />
				 			</div>
				 			<div class="me_right">
					 			<div class="me_datail">关于我们</div>
					 			<div class="icon_right">
									<img src="../../images/icon_more_2.png" />
								</div>
						    </div>
				 		</a>
				 	</li>
				 </ul>
				 
				 
				 <ul class="me-jelly-table-view" v-if="isLogin">
				 	<li class="me-jelly-table-view-cell">
				 		<a @click="logOut">
				 			<div class="login_out">
				 			  退出登录
				 			</div>
				 		</a>
				 	</li>
				 </ul>
			</div>
			
				
			<!--底部导航-->
			<foot-guide></foot-guide>
		</div>
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	import {imgBaseUrl,loginUrl} from 'src/config/env'
	import {getProxy,jsonpProxyApiX} from 'src/service/proxy'
	import {showBack, animate,getStore,getAppInfo,isApp,log,isOk} from 'src/config/mUtils'
	import {getImgPath} from 'src/components/common/mixin'
    import loading from 'src/components/common/loading'
    import footGuide from 'src/components/footer/footGuide'
	import 'src/components/jelly/jelly.js'
    import 'src/components/jelly/jelly.css'
	
	
	export default {
		data(){
	        return {
	        	jumpMap: { //页面跳转埋点日志
	            	helpnew: {path: "/helpnew", log: "MJingFen_NewManCourse"},
	            	me_about: {path: "/me_about", log: "MJingFen_About"},
	            	home: {path: "/home", log: "MJDUnion_Home"},
	            	me_bankinfo:{path:"/me_bankinfo",log:"MJingFen_PersonalData"},
	            	me_settgw:{path:"/me_settgw",log:"MJingFen_SetPromotionLocation"},
                },
                userInfo:{},
                isLogin:false,
		    }
        },
		
		mounted(){
			//getProxy('/userInfoMediaApp').then(res => {
			jsonpProxyApiX('userInfoMediaApp',{},{noFilter:true}).then(res => {
					let result=res;
					if(res.err_code == 0){
						this.userInfo = res.data;
						this.isLogin=true;
					}else if(res.err_code == 2){
						//未开通联盟账号用户跳转注册页
						setTimeout(function () {
                           location.href = '/register.jsp';
                        }, 10);
					}else if (result.err_code == 226) {
		            	$j.toast(result.err_msg);
		           } else if (result.err_code == 206) {
		            	$j.toast(result.err_msg);
	            		setTimeout(function () {
	            			location.href = '/old_user_login.jsp';
	            		}, 10);
		           }else if("204" == result.err_code  || "205" == result.err_code || "201" == result.err_code ||"202" == result.err_code) {
			            location.href = loginUrl;
			       }
		    })
		},
		components: {
	    	footGuide/*,headTop*/
        },
        computed: {
	      
        },
        methods:{
    	    logOut(){
    	    	var ev=this;
    	    	$j.confirm({
    	    		title:['退出登录'],
				    content: '退出当前账号？'
				    ,btn: ['确定', '取消']
				    ,yes: function(){
                        /*log("MJingFen_LogOut");
				    	let url='/logout';
				    	jsonpProxyApiX('logout',{}).then(res => {
			            //getProxy(url).then(res => {
				            if(res.err_code===0){
				            	this.isLogin=false;
							    ev.goPage('home');
							}else{
		                        $j.toast(res.err_msg,'error');
							}
				        })*/
				       ev.myLogout();
				    }
			  });
    	   },
    	   myLogout() {
				//业务域名及appid
				let host  = "jd.com";
				let appid = 253;         
				p_logout.logout(this.callback, host, appid);
			},
			callback(ret) {
				if(ret.errcode == 0) {
					//this.isLogin=false;
					this.goPage('home');
				} else {
					$j.toast(res.err_msg,'error');
				}
			},
    	    goComment(){
    	   	  if(getAppInfo.os == "android"){
					location.href="http://app.qq.com/#id=detail&appid=1105763172";
				} else if(getAppInfo.os == "ios"){
					//location.href="https://itunes.apple.com/us/app/%E4%BA%AC%E4%B8%9C%E8%81%94%E7%9B%9F/id1166427421?l=zh&ls=1&mt=8";   老评分链接
				    location.href="https://itunes.apple.com/app/id1166427421";   //新评分链接
				}else{
					if(this._IsIOS()){
						//location.href="https://itunes.apple.com/us/app/%E4%BA%AC%E4%B8%9C%E8%81%94%E7%9B%9F/id1166427421?l=zh&ls=1&mt=8"; 老评分链接
					    location.href="https://itunes.apple.com/app/id1166427421";   //新评分链接
					}else{
						location.href="http://app.qq.com/#id=detail&appid=1105763172";
					}
				}
    	    },
    	    share(){
    	   	    log("MJingFen_ShareToFriend");
    	   	    if(isApp()){
					location.href="junion://j.u?act=qrcode";
				}else{
					if(this._IsIOS()){
						//location.href="https://itunes.apple.com/us/app/%E4%BA%AC%E4%B8%9C%E8%81%94%E7%9B%9F/id1166427421?l=zh&ls=1&mt=8";   老分享链接
					    location.href="https://itunes.apple.com/app/id1166427421";   //新分享链接
					}else{
						location.href="http://app.qq.com/#id=detail&appid=1105763172";
					}
				}
    	    },
    	    _IsIOS() {
				var ua = navigator.userAgent.toLowerCase();
				if (ua.match(/iPhone\sOS/i) == "iphone os") {
					return true;
				} else {
					return false;
				}
			},
		    _IsAndroid() {
				var ua = navigator.userAgent.toLowerCase();
				if (ua.match(/Android/i) == "android") {
					return true;
				} else {
					return false;
				}
			},
    	   goPage(page){
    	   	  log(this.jumpMap[page]['log']);
    	   	  this.$router.push({path: this.jumpMap[page]['path']});
    	   },
    	   goLocationPage(page){
    	   	   if(!this.isLogin){
    	   	   	  location.href=loginUrl;	
    	   	   }else{
	    	   	  location.href=this.jumpMap[page]['path']+'.jsp';
	    	   	  log(this.jumpMap[page]['log']);
	    	   }
    	   },
    	   tip(){
    	   	let self=this;
    	   	  $j.confirm({
				title: [
				    '京粉',
			    ],
			    content: '个人资料需填写完整，审核通过后方可提取佣金'
			    ,btn: ['完善资料', '取消']
			    ,yes: function(){
			    	self.goLocationPage('me_bankinfo');
			    }
			  });
    	   	  event.stopPropagation();
    	   },
    	   goLogin(){
    	   	  location.href=loginUrl;
    	   }
        },
        watch: {

        }
	}
	
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
    .me-jelly-top{
    	background:rgb(255,255,255);
    	display: -webkit-flex;
        display: flex;
        -webkit-align-items: center;
        align-items: center;
        height:2.52rem;
    	.me_img{
    		height: 1.408rem;
    		width: 1.408rem;
    		margin-left:0.461rem;
    		margin-right:0.341rem;
    		font-size:0;
    		img{
    			width: 100%;
    			height: 100%;
    		}
    	}
    	.me_message{
    		flex: 1;
    		line-height: 0.3rem;
    		h1{
    			font-size: 0;
    			line-height: 0;
    			
    			.phone{
				   color: rgb(0,0,0);
				   font-size: 0.36rem; 
    			}
    			.category{
    				transform: scale(0.5);
    				margin-left: -0.2rem;
				    -webkit-box-sizing: content-box;
				    box-sizing: content-box;
				    font-size: 0.4rem;
				    border: 2px solid #ff120c;
				    color: #ff120c;
				    display: inline-block;
				    border-radius: 0.62rem;
    				width: 1.26rem;
				    height: 0.62rem;
				    line-height: 0.62rem;
				    text-align: center;
				    margin-bottom: -0.15rem;
    			}
    		}
    		.me_lmId{
    			font-size: 0.24rem;
    			margin: 0.2rem 0;
    		}
    		.me_statue{
    			font-size: 0.22rem;
    			color: rgb(102,102,102);
    			img{
    				height: 0.25rem;
    				margin-left: 0.18rem;
    				vertical-align: middle;
    			}
    		}
    	}
    	.me_right{
    		margin-right: 0.525rem;
    		font-size: 0;
    		padding-top: 0.1rem;
			img{
			   height: 0.2rem;
			}
		}
    	
    }
    .me-jelly-content{
    	
    	.me-jelly-table-view{
    		margin-top: 0.17rem;
    		background: rgb(255,255,255);
    		.me-jelly-table-view-cell{
    			a{
		    		display: -webkit-flex;
			        display: flex;
			        -webkit-align-items: center;
			        align-items: center;
			        height: 1.09rem;
			        .me_img{
			        	font-size:0 ;
			        	width:0.46rem;
			        	margin-left:0.39rem;
			            margin-right: 0.19rem;
			        	img{
			        		width: 100%;
			        	}
			        }
			        .me_right{
			        	height: 100%;
			        	display: -webkit-flex;
				        display: flex;
				        -webkit-align-items: center;
				        align-items: center;
				        flex: 1;
				        border-bottom: 1px solid rgb(229,229,229);
			        	.me_datail{
				        	font-size: 0.26rem;
				        	color: rgb(0,0,0);
				        	flex: 1;
				        	padding-left: 0.17rem;
				        }
			        	.icon_right{
				    		margin-right: 0.525rem;
				    		font-size: 0;
							img{
							   height: 0.2rem;
							}
						}
					}
					.login_out{
						text-align: center;
						font-size: 0.3rem;
						flex: 1;
						text-align: center;
						color: rgb(0,0,0);
					}
			    }
		    }
    	}
    }
    .NoLogin{
    	font-size: 0.36rem;
	    color: red;
	    padding:0 1rem;
	    padding-right: 0.5rem;
    }
    .me-jelly-table-view .me-jelly-table-view-cell:last-child .me_right{
		border-bottom: none !important;
	}
</style>