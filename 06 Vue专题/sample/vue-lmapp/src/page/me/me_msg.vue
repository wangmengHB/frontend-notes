<template>
		<div style="background: rgb(245,245,245);">
			<header class="headTop">
					<div class="headMain">
						<a :class="{'head-item':true,'head-active':index==0}" @click="tapTz(0)">
							公告
						</a>
						<a :class="{'head-item':true,'head-active':index==1}" @click="tapTz(1)">
							消息
						</a>
					</div>
			</header>
			
			<div class="main-content">
					<ul v-load-more="loaderMore" class="jelly-table-view" v-if="index==0" >
							<li class="jelly-table-view-cell gg_list" @click="gotoPage(item.noticeId)" v-for="item in noticeArr" :noticeid="item.noticeId" >
								<div class="jelly-time">{{item.releaseTime}}</div>
								<div class="jelly-title">
									<span>{{item.title}}</span>
									<img src="../../images/icon_2.png" />
								</div>
							</li>
					</ul>
					<ul v-load-more="loaderMore"  class="jelly-table-view" v-else>
							<!--<li class="jelly-table-view-cell gg_list" v-for="item in noticeArr" :noticeid="item.noticeId" >-->
							<li @click="gotoPage(item.messageId)" v-for="(item,index) in personInfoArr" :class="{'jelly-table-view-cell jelly-collapse msg_list':true,'jelly-active':index==showIndex}" :messageid="item.messageId"  :messagestatus="item.messageStatus">
							
							    <div class="jelly-time">{{item.messageTime}}</div>
								<div class="jelly-title">
									<span>{{item.title}}</span>
									<img src="../../images/icon_2.png" />
								</div>
							</li>
					</ul>
					<p v-show="!hasData && index==1" class="empty_data">暂无消息</p>
					<p v-show="!hasData && index==0" class="empty_data">暂无公告</p>
					<div class="loading" v-show="isHasDataShow">
						<!--<img v-show="(isHasMessage && index==1) || (isHasNotice && index==0)" class="loadMore" src="../../images/loading.png" />-->
						<img  class="loadMore" src="../../images/loading.png" />
					</div>
					<p v-show="!isHasDataShow && hasData" class="empty_data">没有更多了</p>
					<div style="height:1.2rem ;"></div>
			</div>
		<foot-guide></foot-guide>
		<transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
	</div>
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	import headTop from 'src/components/header/head'
	import footGuide from 'src/components/footer/footGuide'
	import {imgBaseUrl,loginUrl} from 'src/config/env'
	import {getProxy,jsonpProxyApiX} from 'src/service/proxy'
	import {showBack, animate,getStore,log,isOk} from 'src/config/mUtils'
	import loading from 'src/components/common/loading'
    
	import {loadMore} from 'src/components/common/mixin'
	import 'src/components/jelly/jelly.js'
    import 'src/components/jelly/jelly.css'
	export default {
		data(){
	        return {
	        	index:0,
	        	personInfoArr:[],
	        	noticeArr:[],
	        	pageNum1:1,
	        	pageNum2:2,	
	        	pageSize:10,
	        	showIndex:-1,
	        	isHasDataShow: true,
	        	touchend: false,
	        	hasData:true,
	        	/*isHasNotice:true,
	        	isHasMessage:true,
	        	isLoading:false,*/
		    }
        },
		activated(){
			jsonpProxyApiX('userInfoMediaApp',{},{noFilter:true}).then(res => {
					let result=res;
					if(res.err_code == 0){
						
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
		mounted(){
			this.getNotice();
		},
		components: {
	    	footGuide,
	    	headTop,
	    	loading,
        },
        mixins: [loadMore],
        computed: {
	        ...mapState([
	            'isLogin', 'userInfo'
	        ]),
        },
        methods:{
        	...mapActions([
    		   'getUserInfo'
    	    ]),
    	    tapTz(index){
    	    	this.isHasDataShow=true;
    	    	this.hasData=true;
    	    	this.personInfoArr=[];
	        	this.noticeArr=[];
    	    	this.index=index;
    	    	this.touchend=false;
    	    	if(index==0){
    	    		this.showIndex=-1;	
    	    		this.pageNum1=1;
    	    		this.getNotice();
    	    	}else{
    	    		this.pageNum2=1;
    	    		this.getpersonInfo();
    	    	}
    	    },
    	    //到达底部加载更多数据
			async loaderMore(){
				if (this.touchend) {
					return
				}
				//防止重复请求
				if (this.preventRepeatReuqest) {
					return 
				}
				$j.showLoading();
				this.preventRepeatReuqest = true;

				if(this.index==0){
				   this.pageNum1 += 1;
				   this.getNotice();
				}else{
					this.pageNum2 += 1;
					this.getpersonInfo();
				}
			},
    	    async getpersonInfo(){  //获取个人消息列表
    	    	/*this.isLoading=true;*/
				let url='/message/messagePageMediaApp?pageNum='+this.pageNum2+'&pageSize='+this.pageSize;
				//getProxy(url).then(res => {
				jsonpProxyApiX("messagePageMediaApp",{pageNum:this.pageNum2,pageSize:this.pageSize}).then(res => {
					$j.closeLoading();
					if(isOk(res)){
						this.isLoading=false;
			            if(res.data.result==null || res.data.result.length==0){
			                if(this.personInfoArr.length==0){   //判断是否首次加载
						      this.isHasDataShow=false;
						      this.touchend=true;
						      this.hasData=false;
						      /*this.isHasMessage=false;*/
						      //$j.toast("暂无消息");
						    }
						}else{
							this.hasData=true;
							res.data.result.forEach(item=>{
								item.content = item.content.replace(/\n/g,"<br/>")
							});
							this.personInfoArr = [...this.personInfoArr, ...res.data.result];
							//this.isHasMessage=true;
							if (res.data.result.length < this.pageSize) {
								// this.isHasMessage=false;
								 this.isHasDataShow = false;
								 this.touchend = true;
							}else{
								 this.isHasDataShow = true;
							}
						}
					}
					this.preventRepeatReuqest = false;
		        })
	        },
	        async getNotice(){  //获取个人公告列表
	        	//this.isLoading=true;
				let url='/notice/noticePageMediaApp?pageNum='+this.pageNum1+'&pageSize='+this.pageSize;
				console.log(url);
				//getProxy(url).then(res => {
				jsonpProxyApiX("noticePageMediaApp",{pageNum:this.pageNum1,pageSize:this.pageSize}).then(res => {
					$j.closeLoading();
					this.isLoading=false;
					if(isOk(res)){
			            if(res.data.result==null || res.data.result.length==0){
			                if(this.noticeArr.length==0){   //判断是否首次加载
						      this.isHasDataShow=false;
						      this.touchend=true;
						      this.hasData=false;
						      //this.isHasNotice=false;
						      // $j.toast("暂无公告");
						    }
						}else{
							this.hasData=true;
							this.noticeArr = [...this.noticeArr, ...res.data.result];
							//this.isHasNotice=true;
							if (res.data.result.length < this.pageSize) {
								 this.isHasDataShow=false;
								 //this.isHasNotice=false;
								 this.touchend = true;
							}else{
								 this.isHasDataShow=true;
							}
						}
					}
					this.preventRepeatReuqest = false;
		        })
	        },
	        back(){
    		    this.$router.go(-1);
    	    },
    	    read(index){
    	    	if(this.showIndex==index){
    	    	  this.showIndex=-1;	
    	    	}else{
    	    	  this.showIndex=index; 
    	    	}
    	    },
    	    //页面跳转
			gotoPage(id){
				log('MJDUnion_me_msg_details');
				let info;
				if(this.index==0){
					info=this.noticeArr.filter(item => item.noticeId == id)[0];
				}else{
					info=this.personInfoArr.filter(item => item.messageId == id)[0];
				}
				sessionStorage.setItem('detailData',JSON.stringify(info));
				this.$router.push({path: '/me_msg_details'});
		        /*setTimeout(() => {
		        	this.$router.push({path: page, query: {...query}});
		        },100)*/
			}, 
        },
        watch: {

        }
	}
</script>
<style lang="scss" scoped>
    @import 'src/style/mixin';
    .headTop{
    	position: fixed;
    	top: 0;
    	left: 0;
    	width: 100%;
    	height: 0.88rem;
    	background: rgb(255,255,255);
    	z-index: 11;
    	box-shadow: 0 0.02rem 0.04rem rgba(0,0,0,0.15);
    	.headMain{
    		overflow:hidden;
    		zoom:1;
    		height:100%;
    		.head-item{
    			font-size: 0.26rem;
    			text-align: center;
    			width: 50%;
    			float: left;
    			color: rgb(0,0,0);
    			height:100%;
    			padding-top: 0.34rem;
    		}
    		.head-active{
    			color: rgb(255,58,58);
    			border-bottom: 0.04rem solid rgb(255,58,58);
    			height:100%;
    			font-weight: bold;
    		}
    	}
    }
    .main-content{
    	padding-top: 0.88rem;
    	/*padding-bottom: 1.2rem;*/
    	.jelly-table-view{
    		font-size: 0.26rem;
    		.jelly-table-view-cell{
    			.jelly-time{
    				font-size: 0.22rem;
    				height: 0.8rem;
    				text-align:center;
    				padding-top:0.33rem ;
    				background: rgb(245,245,245);
    				color: rgb(163,163,163);
    			}
    			.jelly-title{
    				position: relative;
    				color: rgb(0,0,0);
    				line-height: 0.3rem;
    				background-color: rgb(255,255,255);
    				padding: 0.32rem 1.5rem 0.32rem 0.29rem;
    				img{
    					height: 0.22rem;
    					width: 0.11rem;
    					@include ct;
    					right: 0.32rem;
    				}
    				.jelly-active{
    					color: rgb(163,163,163);
    				}
    			}
    		}
    	}
    }
    
	.empty_data{
		@include sc(0.25rem, #666);
		text-align: center;
		line-height: 1rem;
	}
    .loading{
	 	background: rgb(245,245,245);
	 	height: 0.66rem;
	 	text-align: center;
	 	font-size: 0;
	 	.loadMore{
	 		height: 0.47rem;
	 		width: 0.87rem;
	 		margin-top: 0.2rem;
	 	}
	 }
</style>