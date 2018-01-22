<template>
	<div style="background-color: #f9f5f0;">
		<head-top goBack="true" headTitle="选品库"></head-top>
		<div v-show="!haveSelection" class="no_selection">
			<div class="no_selection_font">您还没有选品库</div>
			<div style="position: relative;">
				<div class="add_selection">新建选品库</div>
			</div>
		</div>
		<div class="selection-content">
			<div v-for="(item, index) in seletions" class="card" @click="clickEvent(item.id, $event, index)">
				<header class="card-header">
					<a class="title">{{item.name}}</a>
					<a class="show_product" v-show="item.products && item.products.length>0">查看商品</a>
				</header>
				<section class="card-content">
					<ul v-if="item.products && item.products.length" class="scroll-container">
						<li v-for="(sku, index) in item.products" class="scroll-item">
							<img class="scroll_img" :src="'https://img12.360buyimg.com/cms/s300x300_'+sku.imageUrl"/>
						</li>
					</ul>
					<div class="mui-card-content-inner" v-else>
						还没有商品！
					</div>
					<div class="content-bottom">
						<span>创建时间：{{item.createTime | formatDate}}</span>
						<span style="margin-left: 0.5rem;">商品数：{{item.skuCount}}</span>
					</div>
				</section>
				<footer class="card-footer">
					<span>
						<a class="del">删除</a>
						<a class="add_product" style="margin: 0 0.08rem;">添加商品</a>
						<a class="edit_product" v-show="item.products && item.products.length>0">页面装修</a>
					</span>
					<a class="share_product" v-show="item.products && item.products.length>0">立即推广</a>
				</footer>
			</div>
		</div>
		<p v-if="touchend" class="empty_data">没有更多了</p>
		<aside class="return_top" @click="backTop" v-if="showBackStatus">
			<svg class="back_top_svg">
				<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
			</svg>
		</aside>
		<foot-guide></foot-guide>
	</div>
</template>

<script>
import headTop from 'src/components/header/head'
import footGuide from 'src/components/footer/footGuide'
import {getProxy} from 'src/service/proxy'
import {showBack, animate, formatDate, isOk} from 'src/config/mUtils'
import 'src/components/jelly/jelly.js'
import 'src/components/jelly/jelly.css'

export default {
	data(){
		return {
			seletions: [],
			pageNum: 1,
			pageSize: 10,
			showBackStatus: false,
			preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
			touchend: false, //没有更多数据
			timestamp: new Date().getTime(),
			haveSelection: true,
		}
	},
	components: {
		headTop,
		footGuide
	},
	mounted(){
        setInterval(() => {
            let now = new Date().getTime();
            if((now - this.timestamp) > 2000){
                location.reload();
            }else{
                this.timestamp = now;
            }
        },1000);

        //解决 safari 浏览器添加商品库刷新后没有跳到顶部
        setTimeout(() => {
            this.backTop();
        },100);

		this.initData();
	},
	methods: {
    	async initData(){
    		$j.showLoading();
    		//选品库列表
    		let res = await getProxy('/library/listDetailLibraries?pageNum='+this.pageNum+'&pageSize='+this.pageSize);

    		if(isOk(res, false)){
	    		if(res.data && res.data.result){
	    			this.seletions = [...res.data.result];
					if (res.data.result.length < this.pageSize) {
						this.touchend = true;
					}
	    		}
    		}else if(res.err_code == 106){
    			this.haveSelection = false;
    		}

    		this.hideLoading();

			//开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
			showBack(status => {
				this.showBackStatus = status;
			});
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
			//this.showLoading = true;
			$j.showLoading();
			this.preventRepeatReuqest = true;

			//页码加1
			this.pageNum += 1;

			let res = await getProxy('/library/listDetailLibraries?pageNum='+this.pageNum+'&pageSize='+this.pageSize);
			
    		if(isOk(res, false)){
	    		if(res.data && res.data.result){
	    			this.seletions = [...res.data.result];
					if (res.data.result.length < this.pageSize) {
						this.touchend = true;
					}
	    		}
    		}else if(res.err_code == 106){
    			this.haveSelection = false;
    		}

    		this.hideLoading();
    		this.preventRepeatReuqest = false;

		},
		clickEvent(id, event){
			console.log(event.target.className)
		},
		//返回顶部
		backTop(){
			animate(document.body, {scrollTop: '0'}, 400,'ease-out');
		},
		//开发环境与编译环境loading隐藏方式不同
		hideLoading(){
			//this.showLoading = false;
			$j.closeLoading();
		}
	},
	watch: {

	},
	filters: {
	    formatDate(date) {
			return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
	    }
	}
}
</script>

<style lang="scss" scoped>
	@import 'src/style/mixin';

	.no_selection{
		margin: 2rem auto;
		text-align: center;
		.no_selection_font{
			font-size: 0.28rem;
			line-height: 0.8rem;
		}
		.add_selection{
			position: absolute;
			@include center;
			top: 0.26rem;
			@include sc(0.24rem, #f23030);
			border: 0.02rem solid #f23030;
			padding: 0.04rem 0.12rem;
			display: inline-block;
		}
	}
	.selection-content{
		padding-top: 0.88rem;
	    background-color: #f9f5f0!important;
	    .card{
			font-size: 0.28rem;
			position: relative;
			overflow: hidden;
			box-shadow: 0 0 0;
			margin: 0.08rem 0 0.2rem 0!important;
			border-radius: 0.04rem;
			background-color: white;
			background-clip: padding-box;
	    }
	    .card-header, card-footer{
			position: relative;
			display: flex;
			min-height: 0.88rem;
			padding: 0.2rem 0.3rem;
			justify-content: space-between;
			align-items: center;
	    }
	    .card-header{
	    	font-size: 0.3rem;
			padding: 0.24rem 0.2rem;
			border-radius: 0.04rem 0.04rem 0 0;
			.title{
				@include sc(0.28rem, #3e3936);
				max-width: 4rem;
				position: absolute;
				left: 0.2rem;
				font-weight: 600;
			    overflow: hidden;
			    white-space: nowrap;
			    text-overflow: ellipsis;
			}
			.show_product{
				@include sc(0.28rem, #827b77);
				position: absolute;
				right: 0.64rem;
			}
	    }
	    .card-content{
			padding: 0.08rem 0;
			font-size: 0.28rem;
			position: relative;
			.scroll-container{
				overflow-x: scroll; 
				@include wh(auto, 1.6rem);
				display: flex;
				justify-content: flex-start;
				.scroll-item{
				    display: inline-block;
				    width: auto;
				    padding-left: 0.2rem;
				    img{
				    	@include wh(1.6rem, 1.6rem);
				    }
				}
			}
			.content-bottom{
				width: 100%;
				line-height: 0.5rem;
				padding: 0.2rem 0.2rem 0.08rem 0.2rem;
				span{
					@include sc(0.22rem, #8d8d8d);
				}
			}
	    }
	    .card-footer{
			padding: 0 0.2rem 0.2rem 0.2rem;
			position: relative;
			a{
				display: inline-block;
				@include wh(1.4rem, 0.6rem);
				background-color: #F9F5F0;
				text-align: center;
				line-height: 0.6rem;
				@include sc(0.24rem, #4a4a4a);
				border-radius: 0.6rem;
			}
			.share_product{
				background-color: #D92F10;
				color: #ffffff;
				float: right;
				position: absolute;
				right: 0.2rem;
				bottom: 0.2rem;
			}
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