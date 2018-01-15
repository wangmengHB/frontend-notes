<template>
	<div :class="{'activity-container-home': page == 'home', 'activity-container-list': page == 'list'}">
		<ul v-load-more="loaderMore" v-if="activityArr.length" type="1">
			<li v-for="item in activityArr" :key="item.actId" class="activity_wrapper">
				<section class="activity-header">
					<div class="left" @click="gotoDetail(item.actId)">
						<img :src="imgFilter(item.imgUrl)">
					</div>
					<div class="right">
						<header class="mui-ellipsis tit" @click="gotoDetail(item.actId)">
							{{item.actTitle}}
						</header>
						<div class="lu" v-if="page == 'list'"> 主营类目 ：{{ categoryCheck(item.firstCategory) }}</div>
						<p class="mui-ellipsis-2 desc" @click="gotoDetail(item.actId)">
							{{item.actItt}}
						</p>
						<div class="share" v-show="page == 'home'" @click="gotoShare(item.actId)">
							<span class="ft1">分享</span>
						</div>
					</div>
				</section>
	            <footer class="activity-footer" v-show="page == 'list'">
	                <div class="left">有效期:{{item.startTime}} 至 {{item.endTime}}</div>
	                <div class="right share" @click="gotoShare(item.actId)">
	                	<span class="ft1">我要推广</span>
	                	<span class="arrow-icon">
		    				<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1">
		    					<!-- <polyline points="0,0 0,20 20,20 20,40 40,40 40,60" style="fill:white;stroke:red;stroke-width:2"/> -->
				    			<polyline points="0,0 50,50 0,100"  style="stroke: red;stroke-width: 15;fill: white;"/>
				    		</svg>
	                	</span>
	                </div>
	            </footer>
			</li>
		</ul>
<!-- 		<ul v-else class="animation_opactiy">
			<li class="list_back_li" v-for="item in 10" :key="item">
				<img src="../../images/shopback.svg" class="list_back_svg">
			</li>
		</ul> -->
		<p v-if="touchend" class="empty_data">没有更多了</p>
		<aside class="return_top" @click="backTop" v-if="showBackStatus">
			<svg class="back_top_svg">
				<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
			</svg>
		</aside>
		<div ref="abc" style="background-color: red;"></div>
		<weixin-share v-if="weixinShare" @closeShare="weixinShare = false"></weixin-share>
	</div>
</template>

<script>

import {mapState} from 'vuex'
import weixinShare from 'src/components/common/weixinShare'
import {getProxy,jsonpProxyApiX} from 'src/service/proxy'
import {imgBaseUrl} from 'src/config/env'
import {showBack, animate, appParameter, log, shareBiz, isOk} from 'src/config/mUtils'
import {loadMore} from './mixin'
import 'src/components/jelly/jelly.js'
import 'src/components/jelly/jelly.css'

export default {
	data(){
		return {
			activityArr:[], // 活动列表数据
			pageNum: 1,
			pageSize: 10,
			preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
			touchend: false, //没有更多数据
			showBackStatus: false, //显示返回顶部按钮
			touchend: false, //没有更多数据
			imgBaseUrl,
			weixinShare: false, //微信分享弹出层
			categoryList: [],
		}
	},
	created(){
		if(this.page == 'list'){
			jsonpProxyApiX('getCategories').then(res => {
	        //getProxy('/adv/getCategories').then(res => {
	            if(isOk(res)){
	                this.categoryList = res.data;
	            }
	        })
		}
	},
	mounted(){
		this.initData();
	},
	components: {
		weixinShare
	},
	props: ['page', 'urlParams', 'refreshList'],
	mixins: [loadMore],
	computed: {
		url: function() {
			if(this.page == 'list') {
				let param={};
				let url = '/adv/listActivities?pageNum='+this.pageNum+'&pageSize='+this.pageSize;
				param.pageNum=this.pageNum;
				param.pageSize=this.pageSize;
				if(this.urlParams.status){
					url+="&status="+this.urlParams.status;
					param.status=this.urlParams.status;
				}
				if(this.urlParams.category){
					url+="&category="+this.urlParams.category;
					param.category=this.urlParams.category;
				}
				if(this.urlParams.type){
					//url+="&type="+this.urlParams.type;
					param.type=this.urlParams.type;
				}
				//return url;
				return {functionId:'listActivities',param:param}
			}
			if(this.page == 'home') //return '/adv/indexListActivities';
			return {functionId:'listActivities',param:{}}
		}
	},
	updated(){

	},
	methods: {
		gotoDetail(actId){
			log("MJDUnion_ActivityDetail")
			let info = this.activityArr.filter(item => item.actId == actId)[0]
			let param = {
			   id: info.actId,
               type: 1,
               title: info.actTitle,
			   imageurl: this.imgFilter(info.imgUrl),
               content: "朋友推荐给我这个商品，感觉很不错，也推荐你用一下",
               url: info.actUrl
            }
			appParameter(param)
		},
		gotoShare(actId){
			let info = this.activityArr.filter(item => item.actId == actId)[0];
			log("MJingFen_WantPromote");
			if(this.page == 'home') log("MJDUnion_Extension")
			if(this.page == 'list') log("MJDUnion_ActivityExtensionAction", info.actId);
			let param = {
			   id: info.actId,
               type: 'activity',
               title: info.actTitle,
			   img: this.imgFilter(info.imgUrl),
               content: "朋友推荐给我这个商品，感觉很不错，也推荐你用一下",
               actUrl: info.actUrl
            }
			shareBiz(param, (status, msg) => {
				if(status){
					$j.toast("请到京粉APP或微信公众号进行推广！");
				}else{
					this.weixinShare = true;
					$j.toast("已设置分享内容，请点击右上角分享！");
				}
			})
		},
		imgFilter(imgUrl){
			if(this.page == 'home'){
				return imgBaseUrl + '/s260x260_' + imgUrl;
			}else if(this.page == 'list'){
				return imgBaseUrl + '/s200x200_' + imgUrl;
			}
		},
		async initData(){
			//获取数据
			$j.showLoading();
			//let res = await getProxy(this.url);
			let res=await jsonpProxyApiX(this.url.functionId,this.url.param);

			if(res.data.result == null){
				this.activityArr = [];
			}else{
				this.activityArr = [...res.data.result];
			}

			if ((this.pageNum-1)*this.pageSize+res.data.result.length >= res.data.total) {
				this.touchend = true;
			}

			this.$nextTick(() => {
				let list = document.querySelectorAll('.activity-header');
				for(let item of list){
					item.style.height=document.querySelector('.activity-header .left').clientWidth + 'px';
				}
			})
			this.hideLoading();
			//开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
			// showBack(status => {
			// 	this.showBackStatus = status;
			// });
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

			//数据的定位加20位
			this.pageNum++;
			//let res = await getProxy(this.url);
			let res=await jsonpProxyApiX(this.url.functionId,this.url.param);
			this.hideLoading();

			if (res.data.result == null) {
				this.touchend = true;
				return
			}

			this.activityArr = [...this.activityArr, ...res.data.result];
			//当获取数据小于20，说明没有更多数据，不需要再次请求数据
			if ((this.pageNum-1)*this.pageSize+res.data.result.length >= res.data.total) {
				this.touchend = true;
				return
			}
			this.preventRepeatReuqest = false;

			this.$nextTick(() => {
				let list = document.querySelectorAll('.activity-header');
				for(let item of list){
					item.style.height=document.querySelector('.activity-header .left').clientWidth + 'px';
				}
			})
		},
		//监听父级传来的数据发生变化时，触发此函数重新根据属性值获取数据
		async listenPropChange(){
			$j.showLoading();
			this.pageNum = 1;
			//let res = await getProxy(this.url);
			let res=await jsonpProxyApiX(this.url.functionId,this.url.param);
			this.hideLoading();
			//考虑到本地模拟数据是引用类型，所以返回一个新的数组
			if(res.data.result == null){
				this.activityArr = [];
				this.touchend = true;
			}else{
				this.activityArr = [...res.data.result];
			}
			//把父组件的refreshList置为false

			this.$nextTick(() => {
				let list = document.querySelectorAll('.activity-header');
				for(let item of list){
					item.style.height=document.querySelector('.activity-header .left').clientWidth + 'px';
				}
			})
		},
		//返回顶部
		backTop(){
			animate(document.body, {scrollTop: '0'}, 400,'ease-out');
		},
		//开发环境与编译环境loading隐藏方式不同
		hideLoading(){
			$j.closeLoading();
		},
	    //根据ID查找类目名
	    categoryCheck(id){
	       let category1 = this.categoryList.filter(item => {
	           return item.categoryId == id.split(",")[1];
	       })
	       let category2 = this.categoryList.filter(item => {
	           return item.categoryId == id.split(",")[2];
	       })
	       return (category1[0] ? category1[0].categoryName:'') + (category2[0] ? category2[0].categoryName:'');
	    }
	},
	filters: {

	},
	watch: {
		//监听父级传来的排序方式
		refreshList: function (value){
			if(value) this.listenPropChange();
			this.$emit('refreshListFun');
		},
	}
}
</script>

<style lang="scss" scoped>
	@import 'src/style/mixin';

	.activity-container-home{
		background-color: #f9f5f0;
		margin-bottom: 1rem;
		.activity-header{
			width: 100%;
			margin-bottom: 0.16rem;
			overflow: hidden;
			background: #fff;
			padding: 0.1rem;
			position: relative;
		}
		.left,.right{
			width: 48%;

		}
		.left{
			height: 100%;
			img{
				display: block;
				@include wh(100%, 100%);
			}
		}
		.right{
			padding-right: 0.04rem;
			.tit{
				@include sc(0.44rem, #232326);
				margin: 21% 0 0 ;
				height: 0.58rem;
				line-height: 0.58rem;
			    overflow: hidden;
			    white-space: nowrap;
			    text-overflow: ellipsis;
			}
			.desc{
				@include sc(0.24rem, #8d8d8d);
				line-height: 0.4rem;
				margin-top: 0.16rem;
			}
			.share{
				@include wh(1.4rem, 0.56rem);
				border-radius: 2rem;
				background-color: #d92f10;
				text-align: center;
				@include sc(0.24rem, #FFFFFF);
				margin-top: 1.02rem;
				position: absolute;
				bottom: 0.4rem;
				right: 0.3rem;
				font-weight: 500;
				padding-left: 0.3rem;
				.ft1{
					vertical-align: middle;
					line-height: 0.56rem;
				}
				span{
					vertical-align: middle;
				}
			}
			.share:after {
				position: absolute;
				content: '';
				top: 0.1rem;
				left: 0.28rem;
				@include wh(0.3rem, 0.3rem);
				background: url(../../images/index_share_icon.png);
				background-size: 100% 100%;
			}
		}
	}
	.activity-container-list{
		.activity_wrapper{
			background: #ffffff;
			margin-top: 0.16rem;
		}
		.activity-header{
			@include wh(100%, auto);
			overflow: hidden;
			background: #ffffff;
			padding: 0.02rem;
			.left,.right{
				width: 48%;
			}
			.left{
				height: 100%;
				img{
					display: block;
					@include wh(100%, 100%);
				}
			}
			.right{
				padding-right: 0.1rem;
				padding-top: 5%;
				.tit{
					@include sc(0.36rem, #232326);
					margin: 0.2rem 0 0;
				}
				.desc{
					@include sc(0.26rem, #8d8d8d);
					line-height: 0.4rem;
					margin-top: 0.2rem;
					height: 0.7rem;
				}
				.data{
					font-size: 0.24rem;
				}
				.lu{
					@include sc(0.26rem, #8d8d8d);
				}
				.share{
					text-align: right;
					font-size: 0.24rem;
					.ft1{
						vertical-align: middle;
						line-height: 0.56rem;
					}
					span{
						vertical-align: middle;
					}
				}
			}
		}
		.activity-footer{
			@include wh(100%, 0.68rem);
			background: #ffffff!important;
			padding-bottom: 0.2rem;
			.left{
				float: left;
				display: inline-block;
				@include sc(0.24rem, #8d8d8d);
				line-height: 0.56rem;
				padding-left: 4%;
			}
			.right{
				float: right;
				position: relative;
				display: inline-block;
				@include wh(25%, 0.56rem);
				line-height: 0.56rem;
				text-align: center;
				margin-right: 3%;
				font-size: 0.24rem;
				line-height: 0.56rem;
				.ft1{
					color: #f23030;
					padding-right: 0.12rem;
					vertical-align: middle;
				}
				.arrow-icon{
					@include wh(0.32rem, 0.32rem);
					@include ct;
				}
			}
		}
	}
	.list_back_li{
		height: 4.85rem;
		.list_back_svg{
			@include wh(100%, 100%)
		}
	}
	.empty_data{
		@include sc(0.25rem, #666);
		text-align: center;
		line-height: 1rem;
	}
	.return_top{
		position: fixed;
		bottom: 1.5rem;
		right: 0.5rem;
		.back_top_svg{
			@include wh(1rem, 1rem);
		}
	}
</style>