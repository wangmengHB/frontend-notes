<template>
	<div class="share-main">
		<head-top goBack="true" headTitle="商品信息"></head-top>
		<div class="main-image" @click="goDetail('img')">
			<img :src="imgBaseUrl + '/s600x300_' + sku.imageUrl" @load="successLoadImg"   class="default-image">
		</div>
		<header class="header">

			<p class="name" @click="goDetail('title')"><self v-if="!sku.isSelf"/>{{sku.skuName}}</p>
			<p class="price">
				<span v-if="sku.hasCoupon == 1" class="jdprice">京东价：¥{{sku.wlPrice | currency}}</span>
				<span>好评数：{{sku.goodComments}}</span>
			</p>
		</header>
		<section class="coupon-price">
			<img v-if="sku.hasCoupon == 1" class="ticket" src="../../images/ticketPrice.png" />
			<span v-else class="number">京东价：</span>
			<span class="rmb">¥</span>
			<span v-if="sku.hasCoupon == 1" class="number">{{sku.couponPrice | currency}}</span>
			<span v-else class="number">{{sku.wlPrice | currency}}</span>
			<div class="arrow" @click="goDetail('arrow')">
				<span class="icon">
					<svg width="100%" height="100%" viewBox="0 0 17 24" xmlns="http://www.w3.org/2000/org" version="1.1">
						<polyline points="0,0 15,12 0,24" style="fill:white; stroke-width: 3;stroke: #bbbbbb;" />
					</svg>
				</span>
			</div>
		</section>
		<footer class="footer">
			<p class="coupon" v-if="sku.hasCoupon == 1"><img src="../../images/coupon.png"><span>优惠券</span><span>¥{{sku.discount | currency}}</span></p>
			<p class="commision" v-if="sku.wlCommission"><img src="../../images/commision.png"><span>通用佣金</span><span>¥{{sku.wlCommission | currency}}</span><span>(预计提成{{sku.wlCommissionShare | bonus}}%)</span></p>
			<!-- <p class="high-commision" v-if="sku.highCommission"><img src="../../images/commision_high.png"><span>超高佣金</span><span>¥{{sku.sku.highCommission}}</span><span>(预计提成35.0%)</span></p> -->
		</footer>
		<div class="html-goods" :class="{ios: iosStyle}">
			<div class="recommend"><span>为您推荐</span></div>
			<productList ref="productList" :filter="filter" page="share" @freshShare="freshShare(true)"></productList>
			<!-- <div class="show-all-goods" @click="$router.push('/promotion_product')"><span>查看全部商品</span></div> -->
		</div>
		<div class="apply-share" @click="goShare(sku)" v-show="!iosStyle">
<!-- 			<svg width="100%" height="1rem" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<linearGradient id="linear_red" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" style="stop-color:rgb(255,116,112);
					stop-opacity:1"/>
						<stop offset="100%" style="stop-color:rgb(255,5,0);
					stop-opacity:1"/>
					</linearGradient>
				</defs>
				<rect width="100%" height="100%" style="fill:url(#linear_red);"/>
			</svg> -->
<!-- 			<canvas ref="canvas"width="375" height="100">
			</canvas> -->
			<span>{{applyOrShare}}</span>
		</div>
	</div>
</template>

<script>
	import headTop from 'src/components/header/head'
	import productList from 'src/components/product/product'
	import {imgBaseUrl} from 'src/config/env'
	import {getSession,shareBiz,log,appParameter} from 'src/config/mUtils'
	import self from 'src/components/common/self'
	import 'src/components/jelly/jelly.js'
	import 'src/components/jelly/jelly.css'

	export default {
		data(){
			return {
				imgBaseUrl,
				sku:  {},
	        	filter:{
	        	   skuId: '',
	        	},
	        	showShareButtion: true,
			}
		},
		computed:{
			applyOrShare: function(){
				return this.sku.highCommission? '申请高拥并分享': '立即分享'
			},
			iosStyle: function() {
				return window.iosStyle
			},
		},
		filters: {
			currency: function(val){
				//if(val) return val.toFixed(2);
				return val;
			},
			bonus: function(val){
				//if(val) return val.toFixed(1);
				return val;
			}
		},
		watch: {

		},
		components:{
			headTop,
			productList,
			self,
		},
		created(){
			this.freshShare()
		},
		mounted(){
			// let context =this.$refs.canvas.getContext("2d");
			   
			// let lGrd = context.createLinearGradient(0,0, 375, 100);
			// lGrd.addColorStop(0, 'rgb(255,116,112)');
			// lGrd.addColorStop(1, 'rgb(255,5,0)');
			// context.fillStyle = lGrd;
			// context.fillRect(0, 0, 375, 100);
		},
		methods:{
			goDetail(from){
		    	switch(from){
		    		case 'img': log("MJingFen_ProductPic",this.sku.skuId,4); break;
		    		case 'title': log("MJingFen_Title",'',4); break;
		    		case 'arrow': log("MJingFen_ProductDetail",'',4); break;
		    		default: break;
		    	}

				appParameter({
				    id: this.sku.skuId,
				    type: 0,
				    title : this.sku.skuName,
				    imageurl: this.imgBaseUrl + '/s600x300_' + this.sku.imageUrl,
				    content: "朋友推荐给我这个商品，感觉很不错，也推荐你用一下",
				    url: this.sku.materialUrl,
				    price: this.sku.wlCommission
				});
			},
			freshShare(freshList){
				let sku = JSON.parse(getSession('skuInfo'));
				this.sku = sku;
				this.filter.skuId = sku.skuId;
				if(freshList){
					this.$refs.productList.getListProducts();
					this.$refs.productList.backTop();
				}
			},
			goShare(sku){
				log("MJingFen_ShareButton");
				let param = {
					...sku,
	                type: 'product',
	                id: sku.skuId,
	                img: this.imgBaseUrl + '/s600x300_' + sku.imageUrl,
	                title: sku.skuName,
	                content: "朋友推荐给我这个商品，感觉很不错，也推荐你用一下",
	                actUrl: sku.materialUrl
	            }
				return shareBiz(param, (status, msg) => {
					if(status){
						$j.toast(msg);
					}else{
						this.weixinShare = true;
						$j.toast(msg);
					}
				})
			},
			successLoadImg(event) {
			    if (event.target.complete == true) {
			        event.target.classList.remove("default-image");;
			    }
			},
		},
	}
</script>

<style lang="scss" scoped>
	@import 'src/style/mixin';

	.share-main{
		margin-top: 0.88rem;
		background-color: #fff;
		.main-image{
			@include wh(100%, 7.5rem);
			img{
				@include wh(100%, 100%);
			}
		}
 		.header{
 			padding: 0.27rem 0.45rem 0 0.3rem ;
 		    .name{
 		    	font-size: 0.3rem;
 		    	font-weight: bold;
 		    	color: rgb(0,0,0);
			    overflow: hidden;
			    text-overflow: ellipsis;
			    display: -webkit-box;
			    -webkit-line-clamp: 2;
			    -webkit-box-orient: vertical;
			    line-height: 0.5rem;
 		    	.isSelf{
 		    		border: 1px solid rgb(255,58,58);
 		    		font-size: 0.18rem;
 		    		color: rgb(255,58,58);
 		    		line-height: 0.425rem;
 		    		padding: 0.01rem 0.05rem;
 		    		margin-right: 0.18rem;
 		    		vertical-align: middle;
 		    	}
 		    }
 		    .price{
 		    	font-size: 0.22rem;
 		    	padding-top: 0.1rem;
 		    	span{
 		    		color: #BEBEBE;
 		    	}
 		    	.jdprice{
 		    		margin-right: 0.2rem;
 		    	}
 		    }
 		}
	    .coupon-price{
	    	position: relative;
	    	@include sc(0.28rem, #000);
	    	padding: 0.2rem 0;
	    	margin-left: 0.3rem;
	    	margin-right: 0.3rem;
	    	border-bottom: 1px dotted #BEBEBE;
	    	.ticket{
	    	   height: 0.26rem;
	    	   vertical-align: middle;
	        }
	        .rmb{
	        	@include sc(0.2rem, #FF3A3A);
	        	font-family: "Medium";
	        }
	        .number{
	        	@include sc(0.38rem, #FF3A3A);
	        	font-weight: bold;
	        }
	        .arrow{
	        	position: absolute;
	        	top: 0;
	        	right: 0;
		        @include wh(0.8rem, 0.8rem);
		        font-size: 0.24rem;
		        line-height: 0.24rem;
		        .icon{
		        	@include wh(0.15rem, 0.24rem);
		        	right: 0rem;
		        	@include ct;
		        }
	        }
	    }
	    .footer{
	    	padding: 0.2rem 0 0.3rem 0.3rem;
	    	p{
		    	@include wh(100%, 0.26rem);
		    	font-size: 0.26rem;
		    	line-height: 0.26rem;
		    	img{
		    		@include wh(0.26rem, 0.26rem);
		    		margin-right: 0.1rem;
		    	}
	    	}
	    	p:nth-child(2),p:nth-child(3){
	    		margin-top: 0.18rem;
	    	}
			span:nth-child(2), span:nth-child(3){
				display: inline-block;
				font-family: "Medium";
			}
			.coupon span{
				font-size:.24rem;
			}
	    	.coupon span:nth-child(2){
	    		letter-spacing: 0.12rem;
				font-size:.24rem;
	    	}
			img{
				transform:translateY(0.04rem);
			}
	    	span:nth-child(2){
	    		width: 1.22rem;
	    	}
	    	span:nth-child(4){
	    		padding-left: 0.19rem;
	    		color: #BEBEBE;
	    	}
	    }
	    .html-goods{
	    	padding-bottom: 1.2rem;
	    	background-color: #F5F5F6;
	    }
	    .recommend{
	    	height: 0.96rem;
	    	position: relative;
			margin-bottom:-.15rem;
	    	span{
	    		@include center;
	    		font-size: 0.3rem;
	    		font-weight: bold;
	    	}
	    }
	    .show-all-goods{
	    	@include wh(100%, 1rem);
	    	position: relative;
	    	font-size: 0.25rem;
	    	background-color: #fff;
	    	span{
	    		display: inline-block;
	    		margin-left: 2.98rem;
	    		@include ct;
	    		color: #666;
	    	}
	    }
	    .apply-share{
	    	@include wh(100%, 1rem);
	    	position: fixed;
	    	left: 0;
	    	bottom: 0;
	    	font-size: 0.34rem;
	    	background: url('../../images/share_footer.png') no-repeat;
	    	background-size: 100% 100%;
	    	span{
	    		display: inline-block;
	    		@include center;
	    		color: #fff;
	    	}
	    }

	    .ios{
	    	padding-bottom: 0!important;
	    }
	    .default-image{ 
	    	background-image: url(../../images/logo_default.png);
	    	background-repeat: no-repeat;
	    	background-size: 2.88rem 2.88rem;
	    	background-position: center center;
        }
	    
	}
</style>